"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekSummaryRoute = void 0;
const get_week_summary_1 = require("../../functions/get-week-summary");
const zod_1 = __importDefault(require("zod"));
const paramsSchema = zod_1.default.object({
    id: zod_1.default.string().min(1), // O parâmetro de rota 'id' deve ser uma string não vazia
});
const getWeekSummaryRoute = async (app) => {
    app.get("/week-summary/:id", {
        schema: {
            params: paramsSchema,
        },
    }, async (request, reply) => {
        const { id } = request.params;
        const { summary } = await (0, get_week_summary_1.getWeekSummary)(id);
        return { summary };
    });
};
exports.getWeekSummaryRoute = getWeekSummaryRoute;
