// Função para marcar a conclusão de uma meta
export async function createGoalCompletion(goalId: string) {
	// Faz uma requisição POST para o endpoint "/completions" no backend
	await fetch("http://localhost:3333/completions", {
		method: "POST", // Define o método HTTP como POST
		headers: {
			"Content-Type": "application/json", // Define o tipo de conteúdo como JSON
		},
		// Serializa o corpo da requisição para JSON, enviando o ID da meta
		body: JSON.stringify({
			goalId, // ID da meta que está sendo marcada como completa
		}),
	});
}
