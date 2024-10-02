"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompletionsRoute = void 0;
const zod_1 = require("zod"); // Importa o Zod, uma biblioteca para validação de esquemas de dados
const create_goal_completion_1 = require("../../functions/create-goal-completion"); // Importa a função que lida com a criação de conclusões de metas
// Define a rota para criar conclusões de metas
const createCompletionsRoute = async (app) => {
    // Registra um manipulador para requisições POST na rota "/completions"
    app.post("/completions", {
        schema: {
            // Define o esquema do corpo da requisição
            body: zod_1.z.object({
                goalId: zod_1.z.string(), // Espera que o corpo contenha um campo "goalId" do tipo string
            }),
        },
    }, async (request) => {
        const { goalId } = request.body; // Extrai o goalId do corpo da requisição
        // Chama a função para criar a conclusão da meta, passando o goalId
        await (0, create_goal_completion_1.createGoalCompletion)({
            goalId,
        });
    });
};
exports.createCompletionsRoute = createCompletionsRoute;
