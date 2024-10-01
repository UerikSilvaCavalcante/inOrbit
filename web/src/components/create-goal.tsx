import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	RadioGroup,
	RadioGroupIndicator,
	RadioGroupItem,
} from "./ui/radio-group";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { createGoal } from "../http/create-goals";
import { useQueryClient } from "@tanstack/react-query";

// Esquema de validação usando Zod, onde 'title' precisa ser uma string e 'desireWeeklyFrequency' precisa ser um número entre 1 e 7.
const createGoalForm = z.object({
	title: z.string().min(1, "Informe a atividade que deseja realizar"),
	desireWeeklyFrequency: z.coerce.number().min(1).max(7),
});

// Inferência automática do tipo com base no esquema Zod
type createGoalForm = z.infer<typeof createGoalForm>;

interface userId {
	id: string;
}

export function CreateGoal({ id }: userId) {
	// Instância do QueryClient usada para invalidar queries após adicionar uma nova meta
	const queryClient = useQueryClient();

	// Hook useForm do react-hook-form com integração do Zod para validação
	const { register, control, handleSubmit, formState, reset } =
		useForm<createGoalForm>({
			// zodResolver integra a validação do Zod no react-hook-form
			resolver: zodResolver(createGoalForm),
		});

	// Função assíncrona que será executada ao submeter o formulário
	async function handleCreateGoal(data: createGoalForm) {
		// Chamada à função createGoal que envia os dados para o backend
		await createGoal({
			title: data.title,
			desireWeeklyFrequency: data.desireWeeklyFrequency,
			userId: id,
		});

		// Invalida as queries para que os dados do "week-summary" e "pending-goals" sejam atualizados após criar a nova meta
		queryClient.invalidateQueries({ queryKey: ["week-summary"] });
		queryClient.invalidateQueries({ queryKey: ["pending-goals"] });

		// Reseta o formulário após o envio bem-sucedido
		reset();
	}

	return (
		<DialogContent>
			<div className="flex flex-col gap-6 h-full">
				{/* Cabeçalho do diálogo com título e botão de fechar */}
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<DialogTitle>Cadastrar meta</DialogTitle>
						{/* Botão para fechar o diálogo */}
						<DialogClose>
							<X className="text-zinc-600 size-5" />
						</DialogClose>
					</div>
					<DialogDescription>
						Adicione atividades que te fazem bem e que você quer continuar
						praticando toda semana.
					</DialogDescription>
				</div>

				{/* Formulário para criação de metas */}
				<form
					onSubmit={handleSubmit(handleCreateGoal)} // handleSubmit processa o formulário e chama handleCreateGoal
					className="flex-1 flex flex-col justify-between max-h-[500px]"
				>
					{/* Campo de entrada para o título da meta */}
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-2">
							<Label htmlFor="title">Qual Atividade ?</Label>
							<Input
								id="title"
								autoFocus
								placeholder="Praticar exercicios, meditar, etc...."
								{...register("title")} // Registra o campo 'title' com react-hook-form
							/>
							{formState.errors.title && (
								<p className="text-red-400 text-sm">
									{formState.errors.title.message}
								</p>
							)}
						</div>

						{/* Seleção da frequência semanal desejada usando RadioGroup e Controller */}
						<div className="flex flex-col gap-2">
							<Label htmlFor="title">Quantas vezes na semana?</Label>
							<Controller
								control={control} // Conecta o controlador ao formulário
								defaultValue={3} // Valor padrão de 3 vezes na semana
								name="desireWeeklyFrequency"
								render={({ field }) => {
									// RadioGroup para escolha da frequência semanal
									return (
										<RadioGroup
											onValueChange={field.onChange} // Atualiza o valor quando o usuário escolhe uma opção
											value={String(field.value)} // Converte o valor para string, já que os valores são strings
										>
											{/* Cada RadioGroupItem é uma opção de frequência */}
											<RadioGroupItem value="1">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none ">
													1x na semana
												</span>
												<span className="text-lg leading-none">🥱</span>
											</RadioGroupItem>
											<RadioGroupItem value="2">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none ">
													2x na semana
												</span>
												<span className="text-lg leading-none">🙂</span>
											</RadioGroupItem>
											<RadioGroupItem value="3">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none ">
													3x na semana
												</span>
												<span className="text-lg leading-none">😎</span>
											</RadioGroupItem>
											{/* Outras opções de frequência */}
											<RadioGroupItem value="4">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none ">
													4x na semana
												</span>
												<span className="text-lg leading-none">😜</span>
											</RadioGroupItem>
											<RadioGroupItem value="5">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none ">
													5x na semana
												</span>
												<span className="text-lg leading-none">🤨</span>
											</RadioGroupItem>
											<RadioGroupItem value="6">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none ">
													6x na semana
												</span>
												<span className="text-lg leading-none">🤯</span>
											</RadioGroupItem>
											<RadioGroupItem value="7">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none ">
													Todos os dias da semana
												</span>
												<span className="text-lg leading-none">🔥</span>
											</RadioGroupItem>
										</RadioGroup>
									);
								}}
							/>
						</div>
					</div>

					{/* Botões de fechar e salvar */}
					<div className="flex items-center gap-3 mt-5">
						<DialogClose asChild>
							<Button className="flex-1" variant="secondary">
								Fechar
							</Button>
						</DialogClose>
						<Button className="flex-1">Salvar</Button>
					</div>
				</form>
			</div>
		</DialogContent>
	);
}
