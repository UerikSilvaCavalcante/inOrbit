"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekSummary = getWeekSummary;
const dayjs_1 = __importDefault(require("dayjs"));
const weekOfYear_1 = __importDefault(require("dayjs/plugin/weekOfYear"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// import { number } from "zod";
// import { count } from "console";
dayjs_1.default.extend(weekOfYear_1.default);
//
async function getWeekSummary(userId) {
    const lastDayOfWeek = (0, dayjs_1.default)().endOf("week").toDate();
    const firstDayOfWeek = (0, dayjs_1.default)().startOf("week").toDate();
    const goalsCreatedUpToWeek = db_1.db.$with("goals_created_up_to_week").as(db_1.db
        .select({
        id: schema_1.goals.id,
        title: schema_1.goals.title,
        desireWeeklyFrequency: schema_1.goals.desireWeeklyFrequency,
        createAt: schema_1.goals.createAt,
        userId: schema_1.goals.userId,
    })
        .from(schema_1.goals)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.goals.createAt, firstDayOfWeek), (0, drizzle_orm_1.lte)(schema_1.goals.createAt, lastDayOfWeek), (0, drizzle_orm_1.eq)(schema_1.goals.userId, userId))));
    const goalsCompletedInWeek = db_1.db.$with("goal_completions_counts").as(db_1.db
        .select({
        id: schema_1.goals.id,
        title: schema_1.goals.title,
        completAt: schema_1.goalCompletions.createAt,
        completeAtDate: (0, drizzle_orm_1.sql /*sql*/) `DATE(${schema_1.goalCompletions.createAt})`.as("completeAtDate"),
    })
        .from(schema_1.goalCompletions)
        .innerJoin(schema_1.goals, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.goals.userId, userId), (0, drizzle_orm_1.eq)(schema_1.goals.id, schema_1.goalCompletions.goalId)))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.goalCompletions.createAt, firstDayOfWeek), (0, drizzle_orm_1.lte)(schema_1.goalCompletions.createAt, lastDayOfWeek)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.goalCompletions.createAt)));
    const goalsCompletedByWeekDay = db_1.db.$with("goals_complete_by_week_day").as(db_1.db
        .select({
        completAtDate: goalsCompletedInWeek.completeAtDate,
        completions: (0, drizzle_orm_1.sql) `/*sql*/
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
        .orderBy((0, drizzle_orm_1.desc)(goalsCompletedInWeek.completeAtDate)));
    const result = await db_1.db
        .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
        .select({
        completed: (0, drizzle_orm_1.sql /*sql*/) `(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(Number),
        total: (0, drizzle_orm_1.sql) `/*sql*/(SELECT SUM(${goalsCreatedUpToWeek.desireWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(Number),
        goalsPerDay: (0, drizzle_orm_1.sql /*sql*/) `JSON_OBJECT_AGG(
            ${goalsCompletedByWeekDay.completAtDate},
            ${goalsCompletedByWeekDay.completions}
        )`,
    })
        .from(goalsCompletedByWeekDay);
    return {
        summary: result[0],
    };
}
