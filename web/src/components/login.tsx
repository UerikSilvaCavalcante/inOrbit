import { z } from "zod"; // Importa a biblioteca zod para validação de esquemas
import logo from "../assets/logo-in-orbit.svg"; // Importa o logo para exibição
import { Button } from "./ui/button"; // Importa o componente de botão
import { Dialog } from "./ui/dialog"; // Importa o componente de diálogo
import { Input } from "./ui/input"; // Importa o componente de entrada
import { Label } from "./ui/label"; // Importa o componente de rótulo
import { zodResolver } from "@hookform/resolvers/zod"; // Importa o resolvedor para usar zod com react-hook-form
import { useForm } from "react-hook-form"; // Importa o hook para gerenciar formulários
import { GetUsername } from "../http/get-username"; // Importa a função para obter o usuário
import { useState } from "react"; // Importa o hook useState para gerenciar o estado
import { useQuery } from "@tanstack/react-query"; // Importa o hook para gerenciar consultas

// Define o esquema de validação do formulário de login
const getUsernameForm = z.object({
	username: z.string().min(1, "Digite seu usuario"), // Validação para o campo username
	password: z.string().min(1, "Digite uma senha"), // Validação para o campo password
});

// Inferência do tipo a partir do esquema de validação
type getUsernameForm = z.infer<typeof getUsernameForm>;

// Componente de login
export function Login({
	onLogin, // Função para lidar com o login
	onToggleForm, // Função para alternar entre Login e Cadastro
}: {
	onLogin: (isLoggedIn: boolean, id: string) => void; // Tipagem para a função onLogin
	onToggleForm: () => void; // Tipagem para a função onToggleForm
}) {
	const [errorMessage, setErrorMessage] = useState(""); // Estado para armazenar mensagens de erro

	const { register, control, handleSubmit, formState, reset } =
		useForm<getUsernameForm>({
			resolver: zodResolver(getUsernameForm), // Usa o resolvedor do zod para validação
		});

	// Função chamada ao enviar o formulário
	async function handleGetUsername(data: getUsernameForm) {
		const response = await GetUsername({
			username: data.username,
			password: data.password,
		});
		// Verifica se a validação do usuário foi bem-sucedida
		if (response.user.validate) {
			onLogin(true, response.user.response.id); // Chama a função de login se o usuário for válido
		} else {
			setErrorMessage("Usuário ou senha incorretos. Tente novamente."); // Atualiza a mensagem de erro
		}
		return response.user.response;
	}

	return (
		<Dialog>
			<div className="h-screen flex flex-col items-center justify-center">
				<div className="w-96 flex flex-col p-2 gap-2 items-center justify-center bg-zinc-900 rounded-lg">
					<div className="h-20 w-48 flex items-center justify-center gap-3">
						<img src={logo} alt="in.orbit" /> {/* Exibe o logo */}
					</div>
					<div className="w-96 h-3/4 flex flex-col items-center justify-center gap-2">
						<div className="w-full h-1/4 flex items-center justify-center">
							<h1 className="font-bold text-5xl text-zinc-400 text-center leading-relaxed max-w-80">
								Login
							</h1>{" "}
							{/* Título do formulário */}
						</div>
						<form
							onSubmit={handleSubmit(handleGetUsername)} // Lida com o envio do formulário
							action=""
							className="w-full h-3/4 p-3 flex flex-col items-center justify-center"
						>
							<div className="w-full flex flex-col items-center justify-center gap-2 mt-12 mb-12">
								<div className="w-3/4 flex flex-col items-start justify-center gap-3 ">
									<Label htmlFor="user">Usuario</Label>{" "}
									{/* Rótulo para o campo de usuário */}
									<Input
										className="w-full"
										id="user"
										autoFocus // Foca automaticamente neste campo
										placeholder="Digite seu usuario"
										{...register("username")} // Registra o campo com react-hook-form
									/>
									{formState.errors.username && (
										<p className="text-red-400 text-sm">Usuario invalido</p> // Mensagem de erro para o campo de usuário
									)}
								</div>
								<div className="w-3/4 flex flex-col items-start justify-center gap-3 ">
									<Label htmlFor="password">Senha</Label>{" "}
									{/* Rótulo para o campo de senha */}
									<Input
										className="w-full"
										id="password"
										placeholder="Digite sua senha"
										{...register("password")} // Registra o campo com react-hook-form
									/>
								</div>
							</div>
							{/* Exibe a mensagem de erro, se houver */}
							{errorMessage && (
								<p className="text-red-400 text-sm mb-4">{errorMessage}</p>
							)}
							<div className=" w-4/5 flex flex-col gap-3 items-center justify-center">
								<Button className="flex - 1 w-full hover:scale-105">
									Entrar {/* Botão de login */}
								</Button>
								<Button
									className="flex-1 w-full bg-zinc-800 hover:bg-zinc-700 hover:scale-105"
									variant="secondary"
									onClick={onToggleForm} // Alterna para o formulário de cadastro
								>
									Cadastrar-se
								</Button>
								<Button className="flex - 1 bg-transparent hover:bg-transparent">
									Esqueci a senha {/* Botão para recuperar a senha */}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Dialog>
	);
}
