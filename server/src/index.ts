import express from 'express'
import dotenv from 'dotenv'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import userRoutes from './routes/userRoutes'
import * as http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes'
import { authenticate } from './middleware/authenticate'

// In production use environment variables instead of .env file. Make sure to set the var NODE_ENV = 'production'.
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

export const app = express()
const server = http.createServer(app)
const io = new Server(server)

const dbURL = process.env.DB_URL ?? ''
const migrationClient = postgres(dbURL, { max: 1 })
migrate(drizzle(migrationClient), {
    migrationsFolder: './drizzle',
})
    .then(() => console.log('Migrations complete'))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })

const queryClient = postgres(dbURL)
export const db = drizzle(queryClient)

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:5173' }))
app.use('/api/users', authenticate, userRoutes)
app.use('/api/auth', authRoutes)

io.on('connection', (socket) => {
    console.log('A user connected')
})

const port = process.env.PORT || 8080
server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})