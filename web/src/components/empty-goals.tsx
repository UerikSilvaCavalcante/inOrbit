import { Plus } from "lucide-react";
import logo from "../assets/logo-in-orbit.svg";
import letstart from "../assets/lets-start.svg";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { CreateGoal } from "./create-goal";
import logout from "../assets/box-arrow-right.svg";

interface userId {
	id: string;
	onLogout: (isLogout: boolean) => void;
}

export function EmptyGoals({ id, onLogout }: userId) {
	function handleLogout() {
		onLogout(false);
	}

	return (
		<Dialog>
			<div className="h-screen w-2/5 m-auto flex flex-col items-center justify-center gap-8">
				<div className="w-3/4 flex items-center justify-end gap-2 md:gap-16 lg:gap-32 ">
					<img src={logo} alt="in.orbit" />
					<img
						src={logout}
						alt="Sair"
						title="Sair"
						className="cursor-pointer"
						onClick={handleLogout}
						onKeyDown={handleLogout}
					/>
				</div>
				<img src={letstart} alt="lets-start" />
				<p className="text-zinc-300 leading-relaxed max-w-80 text-center">
					Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora
					mesmo?
				</p>

				<DialogTrigger asChild>
					<Button>
						<Plus className="size-4" />
						Cadastrar Meta
					</Button>
				</DialogTrigger>

				<CreateGoal id={id as string} />
			</div>
		</Dialog>
	);
}
