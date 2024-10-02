"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletPedingGoals = void 0;
const zod_1 = require("zod");
const delet_pending_goals_1 = require("../../functions/delet-pending-goals");
// Esquema de validação do corpo da requisição
const deleteGoalSchema = zod_1.z.object({
    id: zod_1.z.string(), // Supondo que `id` seja uma string no formato UUID
});
// Definição do plugin Fastify com Zod
const DeletPedingGoals = async (app) => {
    app.delete("/excluir-pending", {
        schema: {
            // Validação do corpo da requisição utilizando Zod
            body: deleteGoalSchema,
        },
    }, async (request, reply) => {
        const { id } = request.body;
        try {
            // Função para deletar o objetivo
            await (0, delet_pending_goals_1.deletPedingGoals)({ id });
            reply.status(200).send({ message: "Objetivo deletado com sucesso!" });
        }
        catch (error) {
            reply.status(500).send({ error: "Erro ao deletar o objetivo." });
        }
    });
};
exports.DeletPedingGoals = DeletPedingGoals;
