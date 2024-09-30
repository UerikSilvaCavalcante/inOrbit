// Define a interface para o objeto que será passado como argumento para a função
interface GetUsername {
	username: string; // O nome de usuário
	password: string; // A senha
}

// Função que faz a requisição POST para autenticar o usuário com base no username e password
export async function GetUsername({ username, password }: GetUsername) {
	// Faz a requisição POST para o endpoint "/username"
	const response = await fetch("https://inorbit-8did.onrender.com/username", {
		method: "POST", // Especifica que o método HTTP é POST
		headers: {
			"Content-Type": "application/json", // Define o tipo de conteúdo como JSON
		},
		body: JSON.stringify({
			username, // Inclui o nome de usuário no corpo da requisição
			password, // Inclui a senha no corpo da requisição
		}),
	});

	// Converte a resposta para JSON
	const data = await response.json();

	// Retorna os dados recebidos da resposta da API
	return data;
}
