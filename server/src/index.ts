import 'express-async-errors'
import express from 'express'
import dotenv from 'dotenv'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import userRoutes from './routes/userRoutes'
import * as http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes'
import { authenticate } from './middleware/authenticate'
import * as schema from './db/schema'
import { checkEnv, getConfig } from './util/EnvManager'
import { setupSocket } from './routes/socket'
import { JWTPayload } from './shared/types'
import deviceRoutes from './routes/deviceRoutes'
import path from 'node:path'
import { errorHandler } from './middleware/errorHandler'

declare module 'express' {
    // @ts-ignore
    interface Request extends express.Request {
        client?: { id: string; type: JWTPayload['type'] }
    }
}

// In production use environment variables instead of .env file. Make sure to set the var NODE_ENV = 'production'.
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}
checkEnv()

export const app = express()
const server = http.createServer(app)
setupSocket(server)

const dbURL = getConfig().DB_URL
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
export const db = drizzle(queryClient, { schema })

// serve static frontend
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: getConfig().NODE_ENV !== 'production' ? '*' : undefined }))
app.use('/api/users', authenticate, userRoutes)
app.use('/api/devices', authenticate, deviceRoutes)
app.use('/api/auth', authRoutes)

// error handling middleware
app.use(errorHandler)

// serve index.html for all other routes
app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).send({ message: 'Not found' })
    }
    res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'))
})

const port = getConfig().PORT
server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
