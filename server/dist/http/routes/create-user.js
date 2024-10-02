"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUser = void 0;
const zod_1 = require("zod"); // Importa o Zod, uma biblioteca para validação de esquemas de dados
const create_user_1 = require("../../functions/create-user"); // Importa as funções para criar usuário e verificar a existência de um nome de usuário
// Define a rota para criar um novo usuário
const CreateUser = async (app) => {
    // Registra um manipulador para requisições POST na rota "/create-user"
    app.post("/create-user", {
        schema: {
            // Define o esquema do corpo da requisição
            body: zod_1.z.object({
                name: zod_1.z.string(), // Espera que o corpo contenha um campo "name" do tipo string
                username: zod_1.z.string(), // Espera que o corpo contenha um campo "username" do tipo string
                password: zod_1.z.string(), // Espera que o corpo contenha um campo "password" do tipo string
            }),
        },
    }, async (request, reply) => {
        // Extrai os dados do corpo da requisição
        const { name, username, password } = request.body;
        try {
            // Verifica se o username já existe
            const res = await (0, create_user_1.exitsUsername)(username);
            if (res) {
                // Retorna erro se o username já estiver em uso
                return reply.status(400).send({ error: "Username já existe" });
            }
            // Cria um novo usuário chamando a função createUser
            await (0, create_user_1.createUser)({
                name,
                username,
                password,
            });
            // Resposta de sucesso
            return reply
                .status(201) // Código de status 201: Created
                .send({ message: "Usuário criado com sucesso" });
        }
        catch (error) {
            // Lida com erros no processo e retorna uma resposta de erro genérica
            return reply.status(500).send({ error: "Erro ao criar usuário" });
        }
    });
};
exports.CreateUser = CreateUser;
