import { z } from "zod"; // Importa o Zod, uma biblioteca para validação de esquemas de dados
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"; // Importa o tipo do plugin Fastify com suporte a Zod
import { createGoalCompletion } from "../../functions/create-goal-completion"; // Importa a função que lida com a criação de conclusões de metas

// Define a rota para criar conclusões de metas
export const createCompletionsRoute: FastifyPluginAsyncZod = async (app) => {
	// Registra um manipulador para requisições POST na rota "/completions"
	app.post(
		"/completions",
		{
			schema: {
				// Define o esquema do corpo da requisição
				body: z.object({
					goalId: z.string(), // Espera que o corpo contenha um campo "goalId" do tipo string
				}),
			},
		},
		async (request) => {
			const { goalId } = request.body; // Extrai o goalId do corpo da requisição

			// Chama a função para criar a conclusão da meta, passando o goalId
			await createGoalCompletion({
				goalId,
			});
		},
	);
};
