// Define o tipo da resposta esperada da API para as metas pendentes
type pendingGoalsResponse = {
	completed: number; // Número de metas concluídas
	total: number; // Total de metas
	goalsPerDay: Record<
		string, // A chave é a data (string)
		{
			id: string; // ID da meta
			title: string; // Título da meta
			desireWeeklyFrequency: number; // Frequência semanal desejada
			completionCount: number; // Quantidade de vezes que a meta foi concluída
		}[]
	>;
};

// Função que busca as metas pendentes do usuário com base no userId
export async function getPendingGoals(
	userId: string,
): Promise<pendingGoalsResponse> {
	// Faz a requisição GET para o endpoint que retorna as metas pendentes do usuário
	const response = await fetch(`http://localhost:3333/pending-goals/${userId}`);

	// Converte a resposta da API para JSON
	const data = await response.json();

	// Retorna o campo `pendingGoals` da resposta da API
	return data.pendingGoals;
}
