import { z } from "zod"; // Importa o Zod, uma biblioteca para validação de esquemas de dados
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"; // Importa o tipo do plugin Fastify com suporte a Zod
import { createGoal } from "../../functions/create-goals"; // Importa a função que lida com a criação de metas

// Define a rota para criar uma nova meta
export const createGoalRoute: FastifyPluginAsyncZod = async (app) => {
	// Registra um manipulador para requisições POST na rota "/goals"
	app.post(
		"/goals",
		{
			schema: {
				// Define o esquema do corpo da requisição
				body: z.object({
					title: z.string(), // Espera que o corpo contenha um campo "title" do tipo string
					desireWeeklyFrequency: z.number().int().min(1).max(7), // Espera um número inteiro entre 1 e 7
					userId: z.string() // Espera que o corpo contenha um campo "userId" do tipo string
				}),
			},
		},
		async (request) => {
			// Extrai os dados do corpo da requisição
			const { title, desireWeeklyFrequency, userId } = request.body;

			// Chama a função para criar a meta, passando os dados extraídos
			await createGoal({
				title,
				desireWeeklyFrequency,
				userId
			});
		},
	);
};
