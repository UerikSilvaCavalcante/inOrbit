"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify")); // Importa o Fastify, um framework para Node.js
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod"); // Importa o provedor de tipo para Zod
const create_goal_1 = require("./routes/create-goal"); // Importa a rota para criar metas
const create_completion_1 = require("./routes/create-completion"); // Importa a rota para criar conclusões
const get_peding_goals_1 = require("./routes/get-peding-goals"); // Importa a rota para obter metas pendentes da semana
const get_week_summary_1 = require("./routes/get-week-summary"); // Importa a rota para obter o resumo da semana
const get_users_1 = require("./routes/get-users"); // Importa a rota para obter usuários
const cors_1 = __importDefault(require("@fastify/cors")); // Importa o plugin CORS para o Fastify
const get_username_1 = require("./routes/get-username"); // Importa a rota para obter o nome de usuário
const delet_past_peding_goals_1 = require("./routes/delet-past-peding-goals"); // Importa a rota para deletar metas passadas
const delet_peding_goal_1 = require("./routes/delet-peding-goal"); // Importa a rota para deletar metas pendentes
const create_user_1 = require("./routes/create-user"); // Importa a rota para criar usuários
// Cria uma instância do Fastify com suporte a tipos Zod
const app = (0, fastify_1.default)().withTypeProvider();
// Configuração do CORS para permitir solicitações de qualquer origem
app.register(cors_1.default, {
    origin: "*",
});
// Define os compiladores de validação e serialização
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
// Registra as rotas no aplicativo
app.register(create_goal_1.createGoalRoute); // Rota para criar uma nova meta
app.register(create_completion_1.createCompletionsRoute); // Rota para criar novas conclusões
app.register(get_peding_goals_1.getWeekPendingGoalsRoute); // Rota para obter metas pendentes da semana
app.register(get_week_summary_1.getWeekSummaryRoute); // Rota para obter o resumo da semana
app.register(get_users_1.getUsers); // Rota para obter a lista de usuários
app.register(get_username_1.GetUsername); // Rota para obter detalhes do usuário pelo nome
app.register(delet_past_peding_goals_1.DeletPastGoals); // Rota para deletar metas passadas
app.register(delet_peding_goal_1.DeletPedingGoals); // Rota para deletar metas pendentes
app.register(create_user_1.CreateUser); // Rota para criar um novo usuário
// Inicializa o servidor na porta 3333 e exibe uma mensagem no console quando estiver em execução
app
    .listen({
    port: 3333,
    host: "0.0.0.0",
})
    .then(() => {
    console.log("HTTP server running!"); // Mensagem indicando que o servidor está ativo
});
