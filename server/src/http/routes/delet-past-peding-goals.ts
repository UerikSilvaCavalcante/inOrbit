import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekPendingGoals } from "../../functions/get-week-pending-goals";
import { deletPastPedingGoals } from "../../functions/delet-past-peding-goals";

export const DeletPastGoals: FastifyPluginAsyncZod = async (app) => {
	app.delete("/delet-past-goals", async () => {
		const { Pastgoals } = await deletPastPedingGoals();

		return { Pastgoals };
	});
};
