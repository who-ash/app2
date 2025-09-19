import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from '@/lib/env';

// Create a connection pool
const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

// Create the Drizzle ORM instance with merged schema
export const db = drizzle(pool, { schema });

// Export the pool for advanced use if needed
export { pool };
