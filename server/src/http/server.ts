import fastify from "fastify"; // Importa o Fastify, um framework para Node.js
import {
	serializerCompiler, // Importa o compilador de serialização
	validatorCompiler, // Importa o compilador de validação
	type ZodTypeProvider, // Importa o tipo de provedor para Zod
} from "fastify-type-provider-zod"; // Importa o provedor de tipo para Zod
import { createGoalRoute } from "./routes/create-goal"; // Importa a rota para criar metas
import { createCompletionsRoute } from "./routes/create-completion"; // Importa a rota para criar conclusões
import { getWeekPendingGoalsRoute } from "./routes/get-peding-goals"; // Importa a rota para obter metas pendentes da semana
import { getWeekSummaryRoute } from "./routes/get-week-summary"; // Importa a rota para obter o resumo da semana
import { getUsers } from "./routes/get-users"; // Importa a rota para obter usuários
import fastifyCors from "@fastify/cors"; // Importa o plugin CORS para o Fastify
import { getUsername } from "../functions/get-username"; // Importa a função para obter o nome de usuário
import { GetUsername } from "./routes/get-username"; // Importa a rota para obter o nome de usuário
import { DeletPastGoals } from "./routes/delet-past-peding-goals"; // Importa a rota para deletar metas passadas
import { DeletPedingGoals } from "./routes/delet-peding-goal"; // Importa a rota para deletar metas pendentes
import { CreateUser } from "./routes/create-user"; // Importa a rota para criar usuários

// Cria uma instância do Fastify com suporte a tipos Zod
const app = fastify().withTypeProvider<ZodTypeProvider>();

// Configuração do CORS para permitir solicitações de qualquer origem
app.register(fastifyCors, {
	origin: "*",
});

// Define os compiladores de validação e serialização
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Registra as rotas no aplicativo
app.register(createGoalRoute); // Rota para criar uma nova meta
app.register(createCompletionsRoute); // Rota para criar novas conclusões
app.register(getWeekPendingGoalsRoute); // Rota para obter metas pendentes da semana
app.register(getWeekSummaryRoute); // Rota para obter o resumo da semana
app.register(getUsers); // Rota para obter a lista de usuários
app.register(GetUsername); // Rota para obter detalhes do usuário pelo nome
app.register(DeletPastGoals); // Rota para deletar metas passadas
app.register(DeletPedingGoals); // Rota para deletar metas pendentes
app.register(CreateUser); // Rota para criar um novo usuário

// Inicializa o servidor na porta 3333 e exibe uma mensagem no console quando estiver em execução
app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log("HTTP server running!"); // Mensagem indicando que o servidor está ativo
	});
