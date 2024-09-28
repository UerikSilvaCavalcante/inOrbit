import { z } from "zod"; // Importa o Zod, uma biblioteca para validação de esquemas de dados
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"; // Importa o tipo do plugin Fastify com suporte a Zod
import { createUser, exitsUsername } from "../../functions/create-user"; // Importa as funções para criar usuário e verificar a existência de um nome de usuário

// Define a rota para criar um novo usuário
export const CreateUser: FastifyPluginAsyncZod = async (app) => {
	// Registra um manipulador para requisições POST na rota "/create-user"
	app.post(
		"/create-user",
		{
			schema: {
				// Define o esquema do corpo da requisição
				body: z.object({
					name: z.string(), // Espera que o corpo contenha um campo "name" do tipo string
					username: z.string(), // Espera que o corpo contenha um campo "username" do tipo string
					password: z.string(), // Espera que o corpo contenha um campo "password" do tipo string
				}),
			},
		},
		async (request, reply) => {
			// Extrai os dados do corpo da requisição
			const { name, username, password } = request.body;

			try {
				// Verifica se o username já existe
				const res = await exitsUsername(username);
				if (res) {
					// Retorna erro se o username já estiver em uso
					return reply.status(400).send({ error: "Username já existe" });
				}

				// Cria um novo usuário chamando a função createUser
				await createUser({
					name,
					username,
					password,
				});

				// Resposta de sucesso
				return reply
					.status(201) // Código de status 201: Created
					.send({ message: "Usuário criado com sucesso" });
			} catch (error) {
				// Lida com erros no processo e retorna uma resposta de erro genérica
				return reply.status(500).send({ error: "Erro ao criar usuário" });
			}
		},
	);
};
