import { db } from "../db"; // Importa a instância do banco de dados
import { goals } from "../db/schema"; // Importa a tabela de metas do esquema do banco de dados

// Define a interface para o pedido de criação de uma nova meta
interface createGoalRequest {
	title: string; // Título da meta
	desireWeeklyFrequency: number; // Frequência desejada de conclusão da meta por semana
	userId: string; // ID do usuário que criou a meta
}

// Função para criar uma nova meta
export async function createGoal({
	title,
	desireWeeklyFrequency,
	userId,
}: createGoalRequest) {
	// Realiza a inserção da nova meta na tabela de metas
	const result = await db
		.insert(goals) // Indica a tabela onde a inserção será feita
		.values({
			// Define os valores a serem inseridos
			title, // Título da meta
			desireWeeklyFrequency, // Frequência desejada da meta
			userId, // ID do usuário associado à meta
		})
		.returning(); // Retorna o resultado da inserção

	const goal = result[0]; // Obtém a primeira (e única) meta inserida

	// Retorna o objeto contendo a meta criada
	return {
		goal,
	};
}
