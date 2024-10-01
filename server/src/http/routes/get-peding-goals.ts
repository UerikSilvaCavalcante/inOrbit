import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekPendingGoals } from "../../functions/get-week-pending-goals";
import z from "zod";

const paramsSchema = z.object({
	id: z.string().min(1), // O parâmetro de rota 'id' deve ser uma string não vazia
});

export const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/pending-goals/:id",
		{
			schema: {
				params: paramsSchema,
			},
		},
		async (request) => {
			const { id } = request.params;
			const { pendingGoals } = await getWeekPendingGoals(id);
			// console.log("peding goals", pendingGoals);
			return { pendingGoals };
		},
	);
};
