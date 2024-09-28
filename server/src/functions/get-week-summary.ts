import dayjs from "dayjs"; // Importa a biblioteca dayjs para manipulação de datas
import weekOfYear from "dayjs/plugin/weekOfYear"; // Importa o plugin weekOfYear para dayjs
import { db } from "../db"; // Importa a instância do banco de dados
import { goalCompletions, goals } from "../db/schema"; // Importa as tabelas de metas e conclusões de metas do esquema do banco de dados
import { and, lte, sql, count, gte, eq, desc } from "drizzle-orm"; // Importa operadores do drizzle-orm para consultas

dayjs.extend(weekOfYear); // Estende dayjs com o plugin weekOfYear

// Interface para representar um usuário (não está sendo usada diretamente na função)
interface User {
	userId: string; // ID do usuário
}

// Função para obter o resumo semanal de metas para um usuário específico
export async function getWeekSummary(userId: string) {
	// Define os limites da semana atual
	const lastDayOfWeek = dayjs().endOf("week").toDate(); // Último dia da semana
	const firstDayOfWeek = dayjs().startOf("week").toDate(); // Primeiro dia da semana

	// Consulta para obter as metas criadas até a semana atual
	const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id, // ID da meta
				title: goals.title, // Título da meta
				desireWeeklyFrequency: goals.desireWeeklyFrequency, // Frequência desejada da meta
				createAt: goals.createAt, // Data de criação da meta
				userId: goals.userId, // ID do usuário que criou a meta
			})
			.from(goals) // Seleciona da tabela de metas
			.where(and(
				gte(goals.createAt, firstDayOfWeek), // Filtra metas criadas a partir do primeiro dia da semana
				lte(goals.createAt, lastDayOfWeek), // Filtra metas criadas até o último dia da semana
				eq(goals.userId, userId) // Filtra pelas metas do usuário específico
			)),
	);

	// Consulta para obter as metas completadas na semana atual
	const goalsCompletedInWeek = db.$with("goal_completions_counts").as(
		db
			.select({
				id: goals.id, // ID da meta
				title: goals.title, // Título da meta
				completAt: goalCompletions.createAt, // Data de conclusão da meta
				completeAtDate: sql /*sql*/`
                    DATE(${goalCompletions.createAt}) // Data de conclusão formatada
                `.as("completeAtDate"),
			})
			.from(goalCompletions) // Seleciona da tabela de conclusões de metas
			.innerJoin(goals, and(eq(goals.userId, userId), eq(goals.id, goalCompletions.goalId))) // Junta as metas e as conclusões
			.where(
				and(
					gte(goalCompletions.createAt, firstDayOfWeek), // Filtra conclusões a partir do primeiro dia da semana
					lte(goalCompletions.createAt, lastDayOfWeek), // Filtra conclusões até o último dia da semana
				),
			)
			.orderBy(desc(goalCompletions.createAt)), // Ordena por data de conclusão
	);

	// Consulta para obter as metas completadas por dia da semana
	const goalsCompletedByWeekDay = db.$with("goals_complete_by_week_day").as(
		db
			.select({
				completAtDate: goalsCompletedInWeek.completeAtDate, // Data de conclusão
				completions: sql /*sql*/`
                JSON_AGG( // Agrega as conclusões em formato JSON
                    JSON_BUILD_OBJECT(
                        'id', ${goalsCompletedInWeek.id},
                        'title', ${goalsCompletedInWeek.title},
                        'completedAt', ${goalsCompletedInWeek.completAt}
                    )
                )
            `.as("completions"),
			})
			.from(goalsCompletedInWeek) // Seleciona da consulta de metas completadas
			.groupBy(goalsCompletedInWeek.completeAtDate) // Agrupa por data de conclusão
			.orderBy(desc(goalsCompletedInWeek.completeAtDate)), // Ordena por data de conclusão
	);

	// Define o tipo para o resultado de metas por dia
	type goalsPerDay = Record<
		string,
		{
			id: string;
			title: string;
			completedAt: string;
		}[]
	>;

	// Consulta final para obter o resumo semanal
	const result = await db
		.with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay) // Usa as três consultas anteriores
		.select({
			completed: sql /*sql*/`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(Number), // Conta o total de metas completadas
			total: sql /*sql*/`(SELECT SUM(${goalsCreatedUpToWeek.desireWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(Number), // Soma a frequência desejada das metas criadas
			goalsPerDay: sql /*sql*/<goalsPerDay>`JSON_OBJECT_AGG( // Agrega os dados de metas por dia
                ${goalsCompletedByWeekDay.completAtDate},
                ${goalsCompletedByWeekDay.completions}
            )`,
		})
		.from(goalsCompletedByWeekDay); // Seleciona da consulta de metas completadas por dia

	// Retorna o resumo das metas da semana
	return {
		summary: result[0], // Retorna o primeiro resultado da consulta
	};
}
