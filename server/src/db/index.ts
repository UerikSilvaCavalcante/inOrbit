import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema'

export const client = postgres('postgresql://nlwdb_owner:MWZYudo4yE7N@ep-broad-hat-a5b1bjt9.us-east-2.aws.neon.tech/nlwdb?sslmode=require')
export const db = drizzle(client, {schema, logger: true})