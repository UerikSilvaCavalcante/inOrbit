import { z } from "zod"; // Biblioteca para validação de esquemas de dados
import logo from "../assets/logo-in-orbit.svg"; // Importa o logo da aplicação
import { Button } from "./ui/button"; // Componente de botão
import { Dialog } from "./ui/dialog"; // Componente de diálogo/modal
import { Input } from "./ui/input"; // Componente de input
import { Label } from "./ui/label"; // Componente de label
import { zodResolver } from "@hookform/resolvers/zod"; // Conector entre Zod e React Hook Form para validação
import { useForm } from "react-hook-form"; // Hook para gerenciar formulários de maneira eficiente
import { useState } from "react"; // Hook para gerenciar estados dentro de componentes
import { CreateUser } from "../http/create-user"; // Função que faz a requisição para criar um usuário

// Esquema de validação usando Zod. Define os campos e suas validações.
const getUser = z.object({
	name: z.string().min(1, "Digite um nome"), // O nome deve ter pelo menos 1 caractere
	username: z.string().min(1, "Digite seu usuario"), // O nome de usuário deve ter pelo menos 1 caractere
	password: z.string().min(1, "Digite uma senha"), // A senha deve ter pelo menos 1 caractere
});

// Define o tipo inferido do formulário baseado no esquema Zod
type getUserForm = z.infer<typeof getUser>;

// Componente de cadastro (SignUp)
export function SignUp({ onToggleForm }: { onToggleForm: () => void }) {
	const [errorMessage, setErrorMessage] = useState(""); // Estado para armazenar mensagens de erro

	// useForm é um hook do react-hook-form para gerenciar o estado do formulário e integrar a validação com Zod
	const { register, handleSubmit, formState } = useForm<getUserForm>({
		resolver: zodResolver(getUser), // Conecta a validação do Zod ao formulário
	});

	// Função para limpar os campos e focar no campo de nome
	function Inputs() {
		const iname = document.getElementById("name") as HTMLInputElement | null;
		const iuser = document.getElementById("user") as HTMLInputElement | null;
		const ipassword = document.getElementById(
			"password",
		) as HTMLInputElement | null;

		iname?.focus();
		if (iname) iname.value = "";
		if (iuser) iuser.value = "";
		if (ipassword) ipassword.value = "";
	}

	// Função chamada ao submeter o formulário
	async function handleGetUser(data: getUserForm) {
		// Envia os dados do formulário para a API usando a função CreateUser
		const response = await CreateUser({
			name: data.name,
			username: data.username,
			password: data.password,
		});

		// Se o usuário já existir, exibe a mensagem de erro e limpa os campos
		if (response.error === "Username já existe") {
			setErrorMessage(response.error); // Define a mensagem de erro
			Inputs(); // Limpa os campos do formulário
		} else {
			setErrorMessage(""); // Limpa qualquer erro anterior
			onToggleForm(); // Troca o formulário para o de login
		}
	}

	return (
		// Estrutura de diálogo/modal
		<Dialog>
			<div className="h-screen flex flex-col items-center justify-center">
				{/* Caixa de cadastro */}
				<div className="w-96 flex flex-col p-2 gap-2 items-center justify-start bg-violet-800 rounded-lg">
					{/* Exibição do logo */}
					<div className="h-20 w-48 flex items-center justify-center gap-3">
						<img src={logo} alt="in.orbit" />
					</div>
					<div className="w-96 h-5/6 flex flex-col items-center justify-center gap-2">
						{/* Título de cadastro */}
						<div className="w-full h-1/4 flex items-center justify-center">
							<h1 className="font-bold text-5xl text-zinc-900 text-center leading-relaxed max-w-80">
								Cadastrar-se
							</h1>
						</div>
						{/* Formulário de cadastro */}
						<form
							onSubmit={handleSubmit(handleGetUser)} // Envia o formulário ao clicar em cadastrar-se
							action=""
							className="w-full h-3/4 p-3 flex flex-col items-center justify-center"
						>
							{/* Campos de input para nome, usuário e senha */}
							<div className="w-full flex flex-col items-center justify-center gap-2 mt-3 mb-3">
								{/* Campo Nome */}
								<div className="w-3/4 flex flex-col items-start justify-center gap-3 ">
									<Label htmlFor="name">Nome</Label>
									<Input
										className="w-full"
										id="name"
										autoFocus
										placeholder="Digite seu nome"
										{...register("name")} // Registra o campo no formulário gerenciado pelo useForm
									/>
									{/* Mensagem de erro se o campo não for válido */}
									{formState.errors.name && (
										<p className="text-red-400 text-sm">Nome invalido</p>
									)}
								</div>
								{/* Campo Usuário */}
								<div className="w-3/4 flex flex-col items-start justify-center gap-3 ">
									<Label htmlFor="user">Usuário</Label>
									<Input
										className="w-full"
										id="user"
										placeholder="Digite seu usuario"
										{...register("username")}
									/>
									{/* Mensagem de erro se o campo não for válido */}
									{formState.errors.username && (
										<p className="text-red-400 text-sm">Usuário inválido</p>
									)}
								</div>
								{/* Campo Senha */}
								<div className="w-3/4 flex flex-col items-start justify-center gap-3 ">
									<Label htmlFor="password">Senha</Label>
									<Input
										className="w-full"
										id="password"
										placeholder="Digite sua senha"
										{...register("password")}
									/>
									{/* Mensagem de erro se o campo não for válido */}
									{formState.errors.password && (
										<p className="text-red-400 text-sm">Senha inválida</p>
									)}
								</div>
								{/* Exibe a mensagem de erro, se houver */}
								{errorMessage && (
									<p className="text-red-400 text-sm mb-4">{errorMessage}</p>
								)}
							</div>

							{/* Botões de Cadastrar-se e Já tenho uma conta */}
							<div className="w-4/5 flex flex-col gap-3 items-center justify-center mb-3">
								<Button className="flex-1 w-full  hover:scale-105">
									Cadastrar-se
								</Button>
								<Button
									className="flex-1 w-full  hover:scale-105 bg-zinc-800 hover:bg-zinc-700 "
									variant="secondary"
									onClick={onToggleForm} // Troca para o formulário de login
								>
									Já tenho uma conta
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Dialog>
	);
}
