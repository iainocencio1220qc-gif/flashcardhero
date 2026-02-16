import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// The fix is here: we add { prepare: false } as the second argument
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
