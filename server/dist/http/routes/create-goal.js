"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGoalRoute = void 0;
const zod_1 = require("zod"); // Importa o Zod, uma biblioteca para validação de esquemas de dados
const create_goals_1 = require("../../functions/create-goals"); // Importa a função que lida com a criação de metas
// Define a rota para criar uma nova meta
const createGoalRoute = async (app) => {
    // Registra um manipulador para requisições POST na rota "/goals"
    app.post("/goals", {
        schema: {
            // Define o esquema do corpo da requisição
            body: zod_1.z.object({
                title: zod_1.z.string(), // Espera que o corpo contenha um campo "title" do tipo string
                desireWeeklyFrequency: zod_1.z.number().int().min(1).max(7), // Espera um número inteiro entre 1 e 7
                userId: zod_1.z.string() // Espera que o corpo contenha um campo "userId" do tipo string
            }),
        },
    }, async (request) => {
        // Extrai os dados do corpo da requisição
        const { title, desireWeeklyFrequency, userId } = request.body;
        // Chama a função para criar a meta, passando os dados extraídos
        await (0, create_goals_1.createGoal)({
            title,
            desireWeeklyFrequency,
            userId
        });
    });
};
exports.createGoalRoute = createGoalRoute;
