// Define o tipo da resposta esperada da API para o resumo da semana
type summaryResponse = {
    completed: number; // Quantidade de metas completadas
    total: number;     // Total de metas da semana
    goalsPerDay: Record<
        string,        // A chave é a data (string)
        {
            id: string;            // ID da meta
            title: string;         // Título da meta
            completedAt: string;   // Data/hora em que a meta foi completada
        }[]
    >;
};

// Função que busca o resumo semanal das metas do usuário com base no userId
export async function getSummary(userId: string): Promise<summaryResponse> {
    // Faz a requisição GET para o endpoint que retorna o resumo semanal do usuário
    const response = await fetch(`http://localhost:3333/week-summary/${userId}`);

    // Converte a resposta da API para JSON
    const data = await response.json();

    // Retorna o campo `summary` da resposta da API
    return data.summary;
}
