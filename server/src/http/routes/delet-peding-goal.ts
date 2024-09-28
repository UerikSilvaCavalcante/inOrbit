import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { FastifyPluginAsync } from "fastify";
import { deletPedingGoals } from "../../functions/delet-pending-goals";

// Esquema de validação do corpo da requisição
const deleteGoalSchema = z.object({
	id: z.string(), // Supondo que `id` seja uma string no formato UUID
});

// Definição do plugin Fastify com Zod
export const DeletPedingGoals: FastifyPluginAsync = async (app) => {
	app.delete(
		"/excluir-pending",
		{
			schema: {
				// Validação do corpo da requisição utilizando Zod
				body: deleteGoalSchema,
			},
		},
		async (request, reply) => {
			const { id } = request.body as z.infer<typeof deleteGoalSchema>;

			try {
				// Função para deletar o objetivo
				await deletPedingGoals({ id });
				reply.status(200).send({ message: "Objetivo deletado com sucesso!" });
			} catch (error) {
				reply.status(500).send({ error: "Erro ao deletar o objetivo." });
			}
		},
	);
};
