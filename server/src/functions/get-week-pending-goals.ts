import dayjs from "dayjs"; // Importa a biblioteca dayjs para manipulação de datas
import weekOfYear from "dayjs/plugin/weekOfYear"; // Importa o plugin weekOfYear para dayjs
import { db } from "../db"; // Importa a instância do banco de dados
import { goalCompletions, goals } from "../db/schema"; // Importa as tabelas de metas e conclusões de metas do esquema do banco de dados
import { and, lte, sql, count, gte, eq } from "drizzle-orm"; // Importa operadores do drizzle-orm para consultas
import { deletPastPedingGoals } from "./delet-past-peding-goals"; // Importa a função para deletar metas passadas

dayjs.extend(weekOfYear); // Estende dayjs com o plugin weekOfYear

// Interface para representar um usuário (não está sendo usada diretamente na função)
interface User {
	userId: string; // ID do usuário
}

// Função para obter metas pendentes da semana para um usuário específico
export async function getWeekPendingGoals(userId: string) {
	// Define os limites da semana atual
	const lastDayOfWeek = dayjs().endOf("week").toDate(); // Último dia da semana
	const firstDayOfWeek = dayjs().startOf("week").toDate(); // Primeiro dia da semana

	// Consulta para obter as metas criadas até a semana atual
	const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desireWeeklyFrequency: goals.desireWeeklyFrequency,
				createAt: goals.createAt,
				userId: goals.userId, // ID do usuário que criou a meta
			})
			.from(goals) // Seleciona da tabela de metas
			.where(
				and(
					gte(goals.createAt, firstDayOfWeek), // Filtra metas criadas a partir do primeiro dia da semana
					lte(goals.createAt, lastDayOfWeek), // Filtra metas criadas até o último dia da semana
					eq(goals.userId, userId), // Filtra pelas metas do usuário específico
				),
			),
	);

	// Consulta para contar as conclusões de metas na semana atual
	const goalCompletionCounts = db.$with("goal_completions_counts").as(
		db
			.select({
				goalId: goalCompletions.goalId, // ID da meta
				completionCount: count(goalCompletions.id).as("completionCount"), // Contagem de conclusões
			})
			.from(goalCompletions) // Seleciona da tabela de conclusões de metas
			.where(
				and(
					gte(goalCompletions.createAt, firstDayOfWeek), // Filtra conclusões a partir do primeiro dia da semana
					lte(goalCompletions.createAt, lastDayOfWeek), // Filtra conclusões até o último dia da semana
				),
			)
			.groupBy(goalCompletions.goalId), // Agrupa por ID da meta
	);

	// Consulta final para unir as metas criadas e as contagens de conclusões
	const pendingGoals = await db
		.with(goalsCreatedUpToWeek, goalCompletionCounts) // Usa as duas consultas anteriores
		.select({
			id: goalsCreatedUpToWeek.id, // Seleciona ID da meta
			title: goalsCreatedUpToWeek.title, // Seleciona título da meta
			desireWeeklyFrequency: goalsCreatedUpToWeek.desireWeeklyFrequency, // Seleciona frequência desejada da meta
			completionCount: sql /*sql*/`
                COALESCE(${goalCompletionCounts.completionCount}, 0) // Substitui valores nulos por 0
            `.mapWith(Number),
		})
		.from(goalsCreatedUpToWeek) // Seleciona da consulta de metas criadas
		.leftJoin(
			goalCompletionCounts,
			eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id), // Realiza um join com as contagens de conclusões
		);

	// Chama a função para deletar metas passadas (sem verificar o resultado)
	deletPastPedingGoals();

	// Retorna as metas pendentes encontradas
	return {
		pendingGoals,
	};
}
