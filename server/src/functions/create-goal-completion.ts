import { db } from "../db"; // Importa a instância do banco de dados
import { goalCompletions, goals } from "../db/schema"; // Importa as tabelas de esquema necessárias
import { and, lte, sql, count, gte, eq } from "drizzle-orm"; // Importa funções do ORM Drizzle para manipulação de consultas
import dayjs from "dayjs"; // Importa a biblioteca Day.js para manipulação de datas

// Define a interface para o pedido de criação de conclusão de meta
interface createGoalCompletionRequest {
	goalId: string; // ID da meta a ser completada
}

// Função para criar uma nova conclusão de meta
export async function createGoalCompletion({
	goalId,
}: createGoalCompletionRequest) {
	// Obtém o último dia da semana atual
	const lastDayOfWeek = dayjs().endOf("week").toDate();
	// Obtém o primeiro dia da semana atual
	const firstDayOfWeek = dayjs().startOf("week").toDate();

	// Cria uma consulta para contar as conclusões de metas na semana atual
	const goalCompletionCounts = db.$with("goal_completions_counts").as(
		db
			.select({
				goalId: goalCompletions.goalId, // Seleciona o ID da meta
				completionCount: count(goalCompletions.id).as("completionCount"), // Conta quantas vezes a meta foi completada
			})
			.from(goalCompletions) // De onde a consulta é feita
			.where(
				and(
					gte(goalCompletions.createAt, firstDayOfWeek), // Filtra pelo início da semana
					lte(goalCompletions.createAt, lastDayOfWeek), // Filtra pelo final da semana
					eq(goalCompletions.goalId, goalId), // Filtra pela meta específica
				),
			)
			.groupBy(goalCompletions.goalId), // Agrupa os resultados pelo ID da meta
	);

	// Executa a consulta para obter a contagem de conclusões
	const result = await db
		.with(goalCompletionCounts)
		.select({
			desireWeeklyFrequency: goals.desireWeeklyFrequency, // Obtém a frequência desejada da meta
			completionCount: sql /*sql*/`
            COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number), // Retorna 0 se não houver contagem de conclusões
		})
		.from(goals) // Seleciona da tabela de metas
		.leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id)) // Realiza uma junção à esquerda com a contagem de conclusões
		.where(eq(goals.id, goalId)) // Filtra pela meta específica
		.limit(1); // Limita os resultados a um

	// Desestrutura os resultados obtidos
	const { completionCount, desireWeeklyFrequency } = result[0];

	// Verifica se a meta já foi completada na frequência desejada
	if (completionCount >= desireWeeklyFrequency) {
		throw new Error("Goal already completed"); // Lança um erro se a meta já foi completada
	}

	// Insere uma nova conclusão de meta no banco de dados
	const insertresult = await db
		.insert(goalCompletions)
		.values({
			goalId, // ID da meta que foi completada
		})
		.returning(); // Retorna o resultado da inserção

	const goalCompletion = insertresult[0]; // Obtém a primeira (e única) conclusão de meta inserida

	return {
		goalCompletion, // Retorna a conclusão da meta criada
	};
}
