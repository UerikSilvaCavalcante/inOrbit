import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { and, lte, sql, count, gte, eq } from "drizzle-orm";
import { DeletPastGoals } from "../http/routes/delet-past-peding-goals";
import { deletPastPedingGoals } from "./delet-past-peding-goals";
import { number } from "zod";
// import { count } from "console";

dayjs.extend(weekOfYear);

//
interface User{
	userId:string
}

export async function getWeekPendingGoals(userId:string) {
	const lastDayOfWeek = dayjs().endOf("week").toDate();
	const firstDayOfWeek = dayjs().startOf("week").toDate();
	// const currentWeek = dayjs().week()

	const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desireWeeklyFrequency: goals.desireWeeklyFrequency,
				createAt: goals.createAt,
				userId:goals.userId
			})
			.from(goals)
			.where(and(
				gte(goals.createAt, firstDayOfWeek),
				lte(goals.createAt, lastDayOfWeek),
				eq(goals.userId, userId)
			)),
	);

	const goalCompletionCounts = db.$with("goal_completions_counts").as(
		db
			.select({
				goalId: goalCompletions.goalId,
				completionCount: count(goalCompletions.id).as("completionCount"),
			})
			.from(goalCompletions)
			.where(
				and(
					gte(goalCompletions.createAt, firstDayOfWeek),
					lte(goalCompletions.createAt, lastDayOfWeek),
				),
			)
			.groupBy(goalCompletions.goalId),
	);

	const pendingGoals = await db
		.with(goalsCreatedUpToWeek, goalCompletionCounts)
		.select({
			id: goalsCreatedUpToWeek.id,
			title: goalsCreatedUpToWeek.title,
			desireWeeklyFrequency: goalsCreatedUpToWeek.desireWeeklyFrequency,
			completionCount: sql/*sql*/
                `COALESCE(${goalCompletionCounts.completionCount}, 0)`
            .mapWith(Number),
		})
		.from(goalsCreatedUpToWeek)
		.leftJoin(
			goalCompletionCounts,
			eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id),
		);

	deletPastPedingGoals()
		
	return {
		pendingGoals,
	};
}