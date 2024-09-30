import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { and, lte, sql, count, gte, eq, desc } from "drizzle-orm";
// import { number } from "zod";
// import { count } from "console";

dayjs.extend(weekOfYear);
interface User {
	userId: string;
}
//
export async function getWeekSummary(userId: string) {
	const lastDayOfWeek = dayjs().endOf("week").toDate();
	const firstDayOfWeek = dayjs().startOf("week").toDate();

	const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desireWeeklyFrequency: goals.desireWeeklyFrequency,
				createAt: goals.createAt,
				userId: goals.userId,
			})
			.from(goals)
			.where(
				and(
					gte(goals.createAt, firstDayOfWeek),
					lte(goals.createAt, lastDayOfWeek),
					eq(goals.userId, userId),
				),
			),
	);

	const goalsCompletedInWeek = db.$with("goal_completions_counts").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				completAt: goalCompletions.createAt,
				completeAtDate: sql /*sql*/`DATE(${goalCompletions.createAt})`.as(
					"completeAtDate",
				),
			})
			.from(goalCompletions)
			.innerJoin(
				goals,
				and(eq(goals.userId, userId), eq(goals.id, goalCompletions.goalId)),
			)
			.where(
				and(
					gte(goalCompletions.createAt, firstDayOfWeek),
					lte(goalCompletions.createAt, lastDayOfWeek),
				),
			)
			.orderBy(desc(goalCompletions.createAt)),
	);

	const goalsCompletedByWeekDay = db.$with("goals_complete_by_week_day").as(
		db
			.select({
				completAtDate: goalsCompletedInWeek.completeAtDate,
				completions: sql`/*sql*/
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', ${goalsCompletedInWeek.id},
                        'title', ${goalsCompletedInWeek.title},
                        'completedAt', ${goalsCompletedInWeek.completAt}
                    )
                )`.as("completions"),
			})
			.from(goalsCompletedInWeek)
			.groupBy(goalsCompletedInWeek.completeAtDate)
			.orderBy(desc(goalsCompletedInWeek.completeAtDate)),
	);

	type goalsPerDay = Record<
		string,
		{
			id: string;
			title: string;
			completedAt: string;
		}[]
	>;

	const result = await db
		.with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
		.select({
			completed:
				sql /*sql*/`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(
					Number,
				),
			total:
				sql`/*sql*/(SELECT SUM(${goalsCreatedUpToWeek.desireWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(
					Number,
				),
			goalsPerDay: sql /*sql*/<goalsPerDay>`JSON_OBJECT_AGG(
            ${goalsCompletedByWeekDay.completAtDate},
            ${goalsCompletedByWeekDay.completions}
        )`,
		})
		.from(goalsCompletedByWeekDay);

	return {
		summary: result[0],
	};
}
