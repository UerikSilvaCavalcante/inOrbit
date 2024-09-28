import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { and, lte, sql, count, gte, eq } from "drizzle-orm";
// import { number } from "zod";
// import { count } from "console";

// dayjs.extend(weekOfYear);
interface PendingGoal{
    id:string
}


export async function deletPedingGoals({id}:PendingGoal) {
    try{
        console.log(id)
        const completions = await db.delete(goalCompletions).where(eq(goalCompletions.goalId, id)).returning()
        const goal = await db.delete(goals).where(eq(goals.id, id)).returning()
        // console.log(goal)
        // console.log(completions)
    }catch(error){
        console.log('Error: ', error)
    }

    return{};
}

