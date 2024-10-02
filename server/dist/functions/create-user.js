"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exitsUsername = exitsUsername;
exports.createUser = createUser;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function exitsUsername(username) {
    const result = await db_1.db.select({ username: schema_1.users.username }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.username, username));
    let exists = false;
    if (result.length > 0) {
        exists = true;
    }
    return exists;
}
async function createUser({ name, username, password }) {
    const result = await db_1.db.insert(schema_1.users).values({
        name,
        username,
        password
    }).returning();
    const user = result[0];
    return {
        user
    };
}
