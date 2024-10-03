// Função responsável por excluir uma meta pendente, recebendo o "id" como parâmetro
export async function deletePendingGoal(id: string) {
    try {
        // Exibe o id da meta que será excluída no console (para fins de depuração)
        console.log(id);

        // Faz uma requisição DELETE para o endpoint "/excluir-pending" no backend
        await fetch("https://inorbitapi.vercel.app/excluir-pending", {
            method: "DELETE", // Define o método HTTP como DELETE
            headers: {
                "Content-Type": "application/json", // Define o tipo de conteúdo como JSON
            },
            // Serializa o corpo da requisição para JSON, enviando o id da meta a ser excluída
            body: JSON.stringify({
                id, // Passa o id da meta pendente a ser excluída
            }),
        });
    } catch (error) {
        // Exibe no console qualquer erro que ocorrer durante a execução da função
        console.log("Error", error);
    }
}
