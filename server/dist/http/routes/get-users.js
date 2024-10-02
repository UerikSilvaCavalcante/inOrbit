"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const get_users_1 = require("../../functions/get-users");
const getUsers = async (app) => {
    app.get("/Users", async () => {
        const { response } = await (0, get_users_1.GetUsers)();
        return { response };
    });
};
exports.getUsers = getUsers;
