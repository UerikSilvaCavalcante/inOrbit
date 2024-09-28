import { client, db } from ".";
import { goalCompletions, goals, users } from "./schema";
import dayjs from 'dayjs'

async function seed() {
    await db.delete(goalCompletions)
    await db.delete(goals)
    await db.delete(users)

    const user = await db.insert(users).values([
        {name: 'Usuario', username:'user', password:'user123'}
    ]).returning()

    const result = await db.insert(goals).values([
        {title: 'Acordar cedo', desireWeeklyFrequency: 5, userId: user[0].id},
        {title: 'Me exercitar', desireWeeklyFrequency: 3, userId: user[0].id }
    ]).returning()

    const startOfWeek = dayjs().startOf('week')
 
    await db.insert(goalCompletions).values([
        {goalId: result[0].id, createAt: startOfWeek.toDate() },
        {goalId: result[1].id, createAt: startOfWeek.add(1,'day').toDate() },
    ])

    
}

seed().finally(() => {
    client.end()
})