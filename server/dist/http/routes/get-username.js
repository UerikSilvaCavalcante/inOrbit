"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsername = void 0;
const zod_1 = require("zod");
const get_username_1 = require("../../functions/get-username");
const GetUsername = async (app) => {
    app.post("/username", {
        schema: {
            body: zod_1.z.object({
                username: zod_1.z.string(),
                password: zod_1.z.string()
            }),
        }
    }, async (request) => {
        const { username, password } = await request.body;
        const user = await (0, get_username_1.getUsername)({
            username,
            password
        });
        return { user };
    });
};
exports.GetUsername = GetUsername;
