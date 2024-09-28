import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { db } from "../db";
import { goalCompletions, goals, users } from "../db/schema";
import { and, lte, sql, count, gte, eq, desc, name } from "drizzle-orm";

interface loginUser{
    username:string,
    password:string
}

export async function getUsername({
    username,
    password
}:loginUser) {
    let validate = false;

    const response = await db.select({
        id:users.id,
        name: users.name,
        username: users.username,
        password:users.password
    }).from(users).where(eq(users.username, username))

    if(password === response[0].password){
        validate = true
    }

    return{ 
        response:response[0],
        validate:validate
    }
}