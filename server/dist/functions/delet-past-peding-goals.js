"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletPastPedingGoals = deletPastPedingGoals;
const dayjs_1 = __importDefault(require("dayjs"));
const weekOfYear_1 = __importDefault(require("dayjs/plugin/weekOfYear"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// import { number } from "zod";
// import { count } from "console";
dayjs_1.default.extend(weekOfYear_1.default);
async function deletPastPedingGoals() {
    const lastDayOfWeek = (0, dayjs_1.default)().endOf("week").toDate();
    const firstDayOfWeek = (0, dayjs_1.default)().startOf("week").toDate();
    const Pastgoals = await db_1.db.select({
        id: schema_1.goals.id,
        createdAt: schema_1.goals.createAt
    }).from(schema_1.goals).where((0, drizzle_orm_1.lte)(schema_1.goals.createAt, firstDayOfWeek));
    for (let id = 0; id < Pastgoals.length; id++) {
        try {
            const deletedCompletions = await db_1.db.delete(schema_1.goalCompletions).where((0, drizzle_orm_1.eq)(schema_1.goalCompletions.goalId, Pastgoals[id].id)).returning();
            console.log(deletedCompletions);
        }
        catch (error) {
            console.log("Erro ao deletar completion", error);
        }
    }
    await db_1.db.delete(schema_1.goals).where((0, drizzle_orm_1.lte)(schema_1.goals.createAt, firstDayOfWeek));
    return { Pastgoals };
}
