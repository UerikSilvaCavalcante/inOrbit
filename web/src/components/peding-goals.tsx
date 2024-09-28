import { Plus } from "lucide-react"; // Importa o ícone de adição
import { OutlineButton } from "./ui/outline-button"; // Componente de botão com contorno
import { getPendingGoals } from "../http/get-pending-goals"; // Função para obter as metas pendentes do servidor
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Hooks para gerenciar e cachear dados de requisições
import { createGoalCompletion } from "../http/create-goal-completion"; // Função para criar a conclusão de uma meta
import trash from "../assets/trash.svg"; // Imagem do ícone de lixeira
import { deletePendingGoal } from "../http/delet-pending-goals"; // Função para deletar uma meta pendente

// Interface para definir o tipo de propriedade 'id' recebida pelo componente
interface userId {
	id: string; // O ID do usuário
}

// Componente que exibe as metas pendentes
export function PendingGoals({ id }: userId) {
	const queryClient = useQueryClient(); // Instância do queryClient para gerenciar o cache de dados

	// Faz uma requisição para obter as metas pendentes do usuário
	const { data } = useQuery({
		queryKey: ["pending-goals", id], // Chave de cache para a consulta
		queryFn: () => getPendingGoals(id), // Função que busca os dados
		staleTime: 1000 * 60, // Tempo em milissegundos antes que os dados se tornem "stale" (60 segundos)
	});

	// Se não houver dados, não renderiza nada
	if (!data) {
		return null;
	}

	// Função para completar uma meta
	async function handleCompletGoal(goalId: string) {
		await createGoalCompletion(goalId); // Chama a função para completar a meta

		// Invalida as consultas para que os dados sejam atualizados
		queryClient.invalidateQueries({ queryKey: ["week-summary"] });
		queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
	}

	// Função para deletar uma meta
	async function handleDeletGoal(id: string) {
		await deletePendingGoal(id); // Chama a função para deletar a meta

		// Invalida as consultas para que os dados sejam atualizados
		queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
		queryClient.invalidateQueries({ queryKey: ["week-summary"] });
	}

	// Renderiza as metas pendentes
	return (
		<div className="flex flex-wrap gap-3">
			{data.map((goal) => {
				return (
					<div
						key={goal.id} // Chave única para cada item da lista
						className="flex items-center px-3 py-2 gap-2 leading-none rounded-full border border-dashed border-zinc-800 text-sm text-zinc-300 hover:border-zinc-700 disabled:opacity-50 disabled:pointer-events-none outline-none focus-visible:border-pink-500 ring-pink-500/10 focus-visible:ring-4"
					>
						{/* Botão para completar a meta */}
						<OutlineButton
							className="border-none px-0 py-0"
							disabled={goal.completionCount >= goal.desireWeeklyFrequency} // Desabilita o botão se a meta já foi completada o suficiente
							onClick={() => handleCompletGoal(goal.id)} // Chama a função ao clicar no botão
						>
							<Plus className="size-4 text-zinc-600" /> {/* Ícone de adição */}
							{goal.title} {/* Título da meta */}
						</OutlineButton>
						{/* Botão para deletar a meta */}
						<div
							className="z-20 cursor-pointer" // Estilo para indicar que é clicável
							onClick={() => handleDeletGoal(goal.id)} // Chama a função ao clicar na lixeira
							onKeyDown={() => handleDeletGoal(goal.id)} // Chama a função ao pressionar uma tecla
						>
							<img src={trash} alt="trash" /> {/* Ícone de lixeira */}
						</div>
					</div>
				);
			})}
		</div>
	);
}
