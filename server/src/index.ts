import express from "express";
import dotenv from "dotenv";
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

// In production use environment variables instead of .env file. Make sure to set the var NODE_ENV = 'production'.
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();

const dbURL = process.env.DB_URL ?? ""
// for migrations
const migrationClient = postgres(dbURL, { max: 1 });
migrate(drizzle(migrationClient), {
    migrationsFolder: "./drizzle",
})
    .then(() => console.log("Migrations complete"))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

const queryClient = postgres(dbURL);
export const db = drizzle(queryClient);

app.get('/', (req, res) => {
    res.send("Express + TypeScript Server");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});