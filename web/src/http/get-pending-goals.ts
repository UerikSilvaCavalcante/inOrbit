// Define o tipo da resposta esperada da API para as metas pendentes
type PendingGoalsResponse = {
	id: string;
	title: string;
	desireWeeklyFrequency: number;
	completionCount: number;
}[];

// Função que busca as metas pendentes do usuário com base no userId
export async function getPendingGoals(
	userId: string,
): Promise<PendingGoalsResponse> {
	// Faz a requisição GET para o endpoint que retorna as metas pendentes do usuário
	const response = await fetch(
		`https://inorbitapi.vercel.app/pending-goals/${userId}`,
	);

	// Converte a resposta da API para JSON
	const data = await response.json();

	// Retorna o campo `pendingGoals` da resposta da API
	return data.pendingGoals;
}
