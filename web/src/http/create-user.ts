// Define o tipo de dados que serão enviados para criar um usuário
interface CreateUserRequest {
	name: string; // Nome completo do usuário
	username: string; // Nome de usuário
	password: string; // Senha do usuário
}

// Função para criar um novo usuário, enviando uma requisição ao servidor
export async function CreateUser({
	name,
	username,
	password,
}: CreateUserRequest) {
	// Faz uma requisição POST para o endpoint "/create-user" no backend
	const response = await fetch("https://inorbit-8did.onrender.com/create-user", {
		method: "POST", // Define o método HTTP como POST
		headers: {
			"Content-Type": "application/json", // Define o tipo de conteúdo como JSON
		},
		// Serializa o corpo da requisição para JSON, enviando os dados do novo usuário
		body: JSON.stringify({
			name, // Nome do usuário
			username, // Nome de usuário
			password, // Senha do usuário
		}),
	});

	// Extrai e transforma a resposta do servidor em JSON
	const data = await response.json();

	// Retorna os dados recebidos do servidor
	return data;
}
