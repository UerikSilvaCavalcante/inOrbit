"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const schema_1 = require("./schema");
const dayjs_1 = __importDefault(require("dayjs"));
async function seed() {
    await _1.db.delete(schema_1.goalCompletions);
    await _1.db.delete(schema_1.goals);
    await _1.db.delete(schema_1.users);
    const user = await _1.db.insert(schema_1.users).values([
        { name: 'Usuario', username: 'user', password: 'user123' }
    ]).returning();
    const result = await _1.db.insert(schema_1.goals).values([
        { title: 'Acordar cedo', desireWeeklyFrequency: 5, userId: user[0].id },
        { title: 'Me exercitar', desireWeeklyFrequency: 3, userId: user[0].id }
    ]).returning();
    const startOfWeek = (0, dayjs_1.default)().startOf('week');
    await _1.db.insert(schema_1.goalCompletions).values([
        { goalId: result[0].id, createAt: startOfWeek.toDate() },
        { goalId: result[1].id, createAt: startOfWeek.add(1, 'day').toDate() },
    ]);
}
seed().finally(() => {
    _1.client.end();
});
