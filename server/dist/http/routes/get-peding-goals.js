"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekPendingGoalsRoute = void 0;
const get_week_pending_goals_1 = require("../../functions/get-week-pending-goals");
const zod_1 = __importDefault(require("zod"));
const paramsSchema = zod_1.default.object({
    id: zod_1.default.string().min(1), // O parâmetro de rota 'id' deve ser uma string não vazia
});
const getWeekPendingGoalsRoute = async (app) => {
    app.get("/pending-goals/:id", {
        schema: {
            params: paramsSchema,
        },
    }, async (request) => {
        const { id } = request.params;
        const { pendingGoals } = await (0, get_week_pending_goals_1.getWeekPendingGoals)(id);
        // console.log("peding goals", pendingGoals);
        return { pendingGoals };
    });
};
exports.getWeekPendingGoalsRoute = getWeekPendingGoalsRoute;
