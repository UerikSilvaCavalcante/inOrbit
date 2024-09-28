import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekSummary } from "../../functions/get-week-summary";
import z from "zod";

const paramsSchema = z.object({
	id: z.string().min(1), // O parâmetro de rota 'id' deve ser uma string não vazia
});

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/week-summary/:id",
		{
			schema: {
				params: paramsSchema,
			},
		},
		async (request, reply) => {
			const { id } = request.params;
			const { summary } = await getWeekSummary(id);

			return { summary };
		},
	);
};
