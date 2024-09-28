import { UniqueOnConstraintBuilder } from "drizzle-orm/sqlite-core";
import { db } from "../db";
import { users } from "../db/schema";
import { and, lte, sql, count, gte, eq } from "drizzle-orm";

interface createUserRequest{
    name:string,
    username:string,
    password:string
}

export async function exitsUsername(username:string) {
    const result = await db.select({username:users.username}).from(users).where(eq(users.username, username))
    let exists = false
    if (result.length > 0){
        exists =  true;
    }
    return exists;
}

export async function createUser({name, username, password}:createUserRequest) {
    const result = await db.insert(users).values({
        name,
        username,
        password
    }).returning()

    const user = result[0];

    return{
        user
    }
}