import { CreateGoal } from "./components/create-goal";
import { EmptyGoals } from "./components/empty-goals";
import { Summary } from "./components/summary";
import { Dialog } from "./components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "./http/get-summary";
import { Login } from "./components/login";
import { useState } from "react";
import { SignUp } from "./components/sign-up";

export function App() {
	// const [count, setCount] = useState(0)
	// const [summary, setSummary] = useState<summaryResponse | null>(null);

	// useEffect(() => {
	// 	fetch("http://localhost:3333/week-summary")
	// 		.then((response) => {
	// 			return response.json();
	// 		})
	// 		.then((data) => {
	// 			setSummary(data.summary);
	// 		});
	// }, []);

	const [id, setId] = useState<string | null>(null);

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLogin, setIsLogin] = useState(true);

	const { data } = useQuery({
		queryKey: ["week-summary", id],
		queryFn: () => getSummary(id as string),
		enabled: !!id,
		staleTime: 1000 * 60, // 60 seconds
	});

	function handleLogin(isLoggedIn: boolean, id: string) {
		setIsLoggedIn(isLoggedIn); // Armazena o resultado do login
		setId(id);

		console.log("Login status:", isLoggedIn);
	}

	// const [isLogout, setIsLogout] = useState(false);

	function handleLogout(isLogout: boolean) {
		setIsLoggedIn(isLogout);
	}

	// Função para alternar entre Login e SignUp
	function toggleForm() {
		setIsLogin(!isLogin); // Inverte o estado atual
	}

	return (
		<>
			<Dialog>
				{!isLoggedIn ? (
					isLogin ? (
						<Login onLogin={handleLogin} onToggleForm={toggleForm} />
					) : (
						<SignUp onToggleForm={toggleForm} />
					)
				) : data?.total && data.total > 0 ? (
					<Summary id={id as string} onLogout={handleLogout} />
				) : (
					<EmptyGoals id={id as string} onLogout={handleLogout}/>
				)}
				{/* {} */}

				{/* <EmptyGoals /> */}
				{/* {data?.total && data.total > 0 ? <Summary /> : <EmptyGoals />} */}
				{/* <Summary/> */}
				<CreateGoal id={id as string} />
			</Dialog>
		</>
	);
}

export default App;
