import { defineConfig } from 'drizzle-kit'
import { env } from './src/env';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './.migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://nlwdb_owner:MWZYudo4yE7N@ep-broad-hat-a5b1bjt9.us-east-2.aws.neon.tech/nlwdb?sslmode=require'
  }
})