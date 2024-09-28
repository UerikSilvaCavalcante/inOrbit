import { Plus } from "lucide-react";
import logo from "../assets/logo-in-orbit.svg";
import letstart from "../assets/lets-start.svg";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { CreateGoal } from "./create-goal";

interface userId {
	id: string;
}

export function EmptyGoals({ id }: userId) {
	return (
		<Dialog>
			<div className="h-screen flex flex-col items-center justify-center gap-8">
				<img src={logo} alt="in.orbit" />
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
