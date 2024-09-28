import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { db } from "../db";
import { goalCompletions, goals, users } from "../db/schema";
import { and, lte, sql, count, gte, eq, desc, name } from "drizzle-orm";

export async function GetUsers() {
    const response = await db.select({
        id:users.id,
        name: users.name,
        username: users.username,
        password:users.password
    }).from(users)

    return {
        response,
    };
}