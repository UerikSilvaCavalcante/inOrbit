import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { and, lte, sql, count, gte, eq } from "drizzle-orm";
// import { number } from "zod";
// import { count } from "console";

dayjs.extend(weekOfYear);

export async function deletPastPedingGoals() {
	const lastDayOfWeek = dayjs().endOf("week").toDate();
	const firstDayOfWeek = dayjs().startOf("week").toDate();

    const Pastgoals = await db.select({
        id:goals.id,
        createdAt:goals.createAt
    }).from(goals).where(lte(goals.createAt, firstDayOfWeek))
   
    for (let id = 0; id < Pastgoals.length; id ++){
        try{
            const deletedCompletions = await db.delete(goalCompletions).where(eq(goalCompletions.goalId, Pastgoals[id].id)).returning();
            console.log(deletedCompletions)
        }catch(error){
            console.log("Erro ao deletar completion", error)
        }
    }

    await db.delete(goals).where(lte(goals.createAt, firstDayOfWeek))

    return{Pastgoals};
}

