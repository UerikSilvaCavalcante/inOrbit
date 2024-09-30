import { DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { CheckCircle2, Plus } from "lucide-react";
import { InOrbitIcon } from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { OutlineButton } from "./ui/outline-button";
import { getSummary } from "../http/get-summary";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-BR";
import { PendingGoals } from "./peding-goals";
import logout from "../assets/box-arrow-right.svg";

dayjs.locale(ptBR); // Configura o dayjs para usar o formato de datas do Brasil

// Define a interface para o componente Summary que recebe id e função de logout como props
interface userId {
	id: string;
	onLogout: (isLogout: boolean) => void;
}

export function Summary({ id, onLogout }: userId) {
	// Realiza uma query usando react-query para buscar o resumo semanal de metas
	const { data } = useQuery({
		queryKey: ["week-summary", id],
		queryFn: () => getSummary(id), // Função que faz a requisição dos dados
		enabled: !!id,
		staleTime: 1000 * 60, // Define o tempo que a query fica "fresca" por 60 segundos
	});

	// Se não houver dados ainda (ex: enquanto carrega), não renderiza nada
	if (!data) {
		return null;
	}

	// Define os dias de início e fim da semana formatados
	const firstDayOfWeek = dayjs().startOf("week").format("D MMM");
	const lastDayOfWeek = dayjs().endOf("week").format("D MMM");

	// Calcula a porcentagem de metas completadas
	const completedPercentage = `${Math.round(
		(data.completed / data.total) * 100,
	)}%`;

	// Função para fazer logout chamando a prop onLogout
	function handlelogout() {
		onLogout(false);
	}

	return (
		<div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<InOrbitIcon /> {/* Ícone customizado */}
					<span className="text-lg font-semibold capitalize">
						{firstDayOfWeek} - {lastDayOfWeek}
					</span>
				</div>
				<div className="w-52 flex gap-8 items-center justify-center">
					<DialogTrigger asChild>
						{/* Botão para abrir o diálogo de criar metas */}
						<Button size="sm">
							<Plus className="size-4" />
							Cadastrar Meta
						</Button>
					</DialogTrigger>
					{/* Ícone para logout */}
					<img
						className="cursor-pointer"
						title="Sair"
						src={logout}
						alt="Sair"
						onClick={handlelogout}
						onKeyUp={handlelogout}
					/>
				</div>
			</div>

			{/* Barra de progresso indicando quantas metas foram completadas */}
			<div className="flex flex-col gap-3">
				<Progress max={data.total} value={data.completed}>
					<ProgressIndicator
						style={{ width: completedPercentage }}
						className={`bg-gradient-to-r from-pink-500 to-violet-500 w-[${completedPercentage}] h-2 rounded-full transition-all`}
					/>
				</Progress>
				<div className="flex items-center justify-between text-xs text-zinc-400">
					<span>
						Você completou{" "}
						<span className="text-zinc-100">{data.completed}</span> de{" "}
						<span className="text-zinc-100">{data.total}</span> metas nesta
						semana.
					</span>
					<span>{completedPercentage}</span>
				</div>
			</div>
			<Separator />
			{/* Renderiza as metas pendentes */}
			<PendingGoals id={id} />

			<div className="flex flex-col gap-6">
				<h2 className="text-xl font-medium">Sua semana</h2>

				{/* Se houver metas diárias, lista-as. Senão, exibe uma mensagem */}
				{data.goalsPerDay != null ? (
					Object.entries(data.goalsPerDay).map(([date, goals]) => {
						const weekDay = dayjs(date).format("dddd");
						const formattedDate = dayjs(date).format("D[ de ]MMMM");
						return (
							<div key={date} className="flex flex-col gap-6">
								<h3 className="font-medium">
									<span className="capitalize">{weekDay} </span>
									<span className="text-zinc-400 text-xs">
										({formattedDate})
									</span>
								</h3>

								<ul className="flex flex-col gap-3">
									{/* Lista cada meta concluída */}
									{goals.map((goal) => {
										const time = dayjs(goal.completedAt).format("HH:mm");

										return (
											<li key={goal.id} className="flex items-center gap-2">
												<CheckCircle2 className="size-4 text-pink-500" />
												<span className="text-sm text-zinc-400">
													Você completou "{goal.title}" às {time}h
												</span>
											</li>
										);
									})}
								</ul>
							</div>
						);
					})
				) : (
					<h2 className="text-center font-medium">
						Nenhuma meta completada por enquanto!!
					</h2>
				)}
			</div>
		</div>
	);
}
