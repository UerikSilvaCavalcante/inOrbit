"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsers = GetUsers;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
async function GetUsers() {
    const response = await db_1.db.select({
        id: schema_1.users.id,
        name: schema_1.users.name,
        username: schema_1.users.username,
        password: schema_1.users.password
    }).from(schema_1.users);
    return {
        response,
    };
}
