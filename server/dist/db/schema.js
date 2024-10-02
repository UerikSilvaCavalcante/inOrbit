"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.goalCompletions = exports.goals = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const cuid2_1 = require("@paralleldrive/cuid2");
exports.goals = (0, pg_core_1.pgTable)('goals', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    userId: (0, pg_core_1.text)('user_id').references(() => exports.users.id).notNull(),
    title: (0, pg_core_1.text)('title').notNull(),
    desireWeeklyFrequency: (0, pg_core_1.integer)('desired_Weekly_Frequency').notNull(),
    createAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
});
exports.goalCompletions = (0, pg_core_1.pgTable)('goal_comletions', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    goalId: (0, pg_core_1.text)('goal_id').references(() => exports.goals.id).notNull(),
    createAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
});
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    name: (0, pg_core_1.text)('Name').notNull(),
    username: (0, pg_core_1.text)('Username').notNull(),
    password: (0, pg_core_1.text)('password').notNull()
});
