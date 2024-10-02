"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsername = getUsername;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function getUsername({ username, password }) {
    let validate = false;
    const response = await db_1.db
        .select({
        id: schema_1.users.id,
        name: schema_1.users.name,
        username: schema_1.users.username,
        password: schema_1.users.password,
    })
        .from(schema_1.users)
        .where((0, drizzle_orm_1.eq)(schema_1.users.username, username));
    if (response.length > 0) {
        if (password === response[0].password) {
            validate = true;
        }
    }
    return {
        response: response[0],
        validate: validate,
    };
}
