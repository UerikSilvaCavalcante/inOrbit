"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletPastGoals = void 0;
const delet_past_peding_goals_1 = require("../../functions/delet-past-peding-goals");
const DeletPastGoals = async (app) => {
    app.delete("/delet-past-goals", async () => {
        const { Pastgoals } = await (0, delet_past_peding_goals_1.deletPastPedingGoals)();
        return { Pastgoals };
    });
};
exports.DeletPastGoals = DeletPastGoals;
