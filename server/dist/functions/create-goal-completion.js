"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGoalCompletion = createGoalCompletion;
const db_1 = require("../db"); // Importa a instância do banco de dados
const schema_1 = require("../db/schema"); // Importa as tabelas de esquema necessárias
const drizzle_orm_1 = require("drizzle-orm"); // Importa funções do ORM Drizzle para manipulação de consultas
const dayjs_1 = __importDefault(require("dayjs")); // Importa a biblioteca Day.js para manipulação de datas
// Função para criar uma nova conclusão de meta
async function createGoalCompletion({ goalId, }) {
    // Obtém o último dia da semana atual
    const lastDayOfWeek = (0, dayjs_1.default)().endOf("week").toDate();
    // Obtém o primeiro dia da semana atual
    const firstDayOfWeek = (0, dayjs_1.default)().startOf("week").toDate();
    // Cria uma consulta para contar as conclusões de metas na semana atual
    const goalCompletionCounts = db_1.db.$with("goal_completions_counts").as(db_1.db
        .select({
        goalId: schema_1.goalCompletions.goalId, // Seleciona o ID da meta
        completionCount: (0, drizzle_orm_1.count)(schema_1.goalCompletions.id).as("completionCount"), // Conta quantas vezes a meta foi completada
    })
        .from(schema_1.goalCompletions) // De onde a consulta é feita
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.goalCompletions.createAt, firstDayOfWeek), // Filtra pelo início da semana
    (0, drizzle_orm_1.lte)(schema_1.goalCompletions.createAt, lastDayOfWeek), // Filtra pelo final da semana
    (0, drizzle_orm_1.eq)(schema_1.goalCompletions.goalId, goalId)))
        .groupBy(schema_1.goalCompletions.goalId));
    // Executa a consulta para obter a contagem de conclusões
    const result = await db_1.db
        .with(goalCompletionCounts)
        .select({
        desireWeeklyFrequency: schema_1.goals.desireWeeklyFrequency, // Obtém a frequência desejada da meta
        completionCount: (0, drizzle_orm_1.sql /*sql*/) `
            COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number), // Retorna 0 se não houver contagem de conclusões
    })
        .from(schema_1.goals) // Seleciona da tabela de metas
        .leftJoin(goalCompletionCounts, (0, drizzle_orm_1.eq)(goalCompletionCounts.goalId, schema_1.goals.id)) // Realiza uma junção à esquerda com a contagem de conclusões
        .where((0, drizzle_orm_1.eq)(schema_1.goals.id, goalId)) // Filtra pela meta específica
        .limit(1); // Limita os resultados a um
    // Desestrutura os resultados obtidos
    const { completionCount, desireWeeklyFrequency } = result[0];
    // Verifica se a meta já foi completada na frequência desejada
    if (completionCount >= desireWeeklyFrequency) {
        throw new Error("Goal already completed"); // Lança um erro se a meta já foi completada
    }
    // Insere uma nova conclusão de meta no banco de dados
    const insertresult = await db_1.db
        .insert(schema_1.goalCompletions)
        .values({
        goalId, // ID da meta que foi completada
    })
        .returning(); // Retorna o resultado da inserção
    const goalCompletion = insertresult[0]; // Obtém a primeira (e única) conclusão de meta inserida
    return {
        goalCompletion, // Retorna a conclusão da meta criada
    };
}
