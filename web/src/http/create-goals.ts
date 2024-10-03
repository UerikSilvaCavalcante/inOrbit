// Define a interface para os dados que serão enviados na requisição
interface CreateGoalRequest {
	title: string; // Título da meta
	desireWeeklyFrequency: number; // Frequência semanal desejada (número de vezes por semana)
	userId: string; // ID do usuário que está criando a meta
}

// Função para criar uma meta, aceitando um objeto do tipo CreateGoalRequest
export async function createGoal({
	title,
	desireWeeklyFrequency,
	userId,
}: CreateGoalRequest) {
	// Realiza uma requisição POST para o endpoint "/goals" no backend
	await fetch("https://inorbitapi.vercel.app/goals", {
		method: "POST", // Define o método HTTP como POST
		headers: {
			"Content-Type": "application/json", // Define o tipo de conteúdo como JSON
		},
		// Serializa o corpo da requisição para JSON, contendo as informações da meta e o ID do usuário
		body: JSON.stringify({
			title,
			desireWeeklyFrequency,
			userId,
		}),
	});
}
