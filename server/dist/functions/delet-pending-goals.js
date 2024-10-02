"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletPedingGoals = deletPedingGoals;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function deletPedingGoals({ id }) {
    try {
        console.log(id);
        const completions = await db_1.db.delete(schema_1.goalCompletions).where((0, drizzle_orm_1.eq)(schema_1.goalCompletions.goalId, id)).returning();
        const goal = await db_1.db.delete(schema_1.goals).where((0, drizzle_orm_1.eq)(schema_1.goals.id, id)).returning();
        // console.log(goal)
        // console.log(completions)
    }
    catch (error) {
        console.log('Error: ', error);
    }
    return {};
}
