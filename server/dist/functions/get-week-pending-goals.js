"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekPendingGoals = getWeekPendingGoals;
const dayjs_1 = __importDefault(require("dayjs"));
const weekOfYear_1 = __importDefault(require("dayjs/plugin/weekOfYear"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const delet_past_peding_goals_1 = require("./delet-past-peding-goals");
// import { count } from "console";
dayjs_1.default.extend(weekOfYear_1.default);
async function getWeekPendingGoals(userId) {
    const lastDayOfWeek = (0, dayjs_1.default)().endOf("week").toDate();
    const firstDayOfWeek = (0, dayjs_1.default)().startOf("week").toDate();
    // const currentWeek = dayjs().week()
    const goalsCreatedUpToWeek = db_1.db.$with("goals_created_up_to_week").as(db_1.db
        .select({
        id: schema_1.goals.id,
        title: schema_1.goals.title,
        desireWeeklyFrequency: schema_1.goals.desireWeeklyFrequency,
        createAt: schema_1.goals.createAt,
        userId: schema_1.goals.userId
    })
        .from(schema_1.goals)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.goals.createAt, firstDayOfWeek), (0, drizzle_orm_1.lte)(schema_1.goals.createAt, lastDayOfWeek), (0, drizzle_orm_1.eq)(schema_1.goals.userId, userId))));
    const goalCompletionCounts = db_1.db.$with("goal_completions_counts").as(db_1.db
        .select({
        goalId: schema_1.goalCompletions.goalId,
        completionCount: (0, drizzle_orm_1.count)(schema_1.goalCompletions.id).as("completionCount"),
    })
        .from(schema_1.goalCompletions)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.goalCompletions.createAt, firstDayOfWeek), (0, drizzle_orm_1.lte)(schema_1.goalCompletions.createAt, lastDayOfWeek)))
        .groupBy(schema_1.goalCompletions.goalId));
    const pendingGoals = await db_1.db
        .with(goalsCreatedUpToWeek, goalCompletionCounts)
        .select({
        id: goalsCreatedUpToWeek.id,
        title: goalsCreatedUpToWeek.title,
        desireWeeklyFrequency: goalsCreatedUpToWeek.desireWeeklyFrequency,
        completionCount: (0, drizzle_orm_1.sql /*sql*/) `COALESCE(${goalCompletionCounts.completionCount}, 0)`
            .mapWith(Number),
    })
        .from(goalsCreatedUpToWeek)
        .leftJoin(goalCompletionCounts, (0, drizzle_orm_1.eq)(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id));
    (0, delet_past_peding_goals_1.deletPastPedingGoals)();
    return {
        pendingGoals,
    };
}
