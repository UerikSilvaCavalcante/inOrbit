import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2'

export const goals = pgTable('goals', {
    id: text('id').primaryKey().$defaultFn(()=> createId()),
    userId: text('user_id').references(() => users.id).notNull(),
    title: text('title').notNull(),
    desireWeeklyFrequency: integer('desired_Weekly_Frequency').notNull(),
    createAt: timestamp ('created_at', {withTimezone:true}).notNull().defaultNow(),
})

export const goalCompletions = pgTable('goal_comletions', {
    id: text('id').primaryKey().$defaultFn(()=> createId()),
    goalId:text('goal_id').references(() => goals.id).notNull(),
    createAt: timestamp ('created_at', {withTimezone:true}).notNull().defaultNow(),
})

export const users = pgTable('users' , {
    id: text('id').primaryKey() .$defaultFn(()=> createId()),
    name: text('Name').notNull(),
    username:text('Username').notNull(),
    password:text('password').notNull()
})