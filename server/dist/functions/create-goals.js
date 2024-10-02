"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGoal = createGoal;
const db_1 = require("../db"); // Importa a instância do banco de dados
const schema_1 = require("../db/schema"); // Importa a tabela de metas do esquema do banco de dados
// Função para criar uma nova meta
async function createGoal({ title, desireWeeklyFrequency, userId, }) {
    // Realiza a inserção da nova meta na tabela de metas
    const result = await db_1.db
        .insert(schema_1.goals) // Indica a tabela onde a inserção será feita
        .values({
        // Define os valores a serem inseridos
        title, // Título da meta
        desireWeeklyFrequency, // Frequência desejada da meta
        userId, // ID do usuário associado à meta
    })
        .returning(); // Retorna o resultado da inserção
    const goal = result[0]; // Obtém a primeira (e única) meta inserida
    // Retorna o objeto contendo a meta criada
    return {
        goal,
    };
}
