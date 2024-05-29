import * as http from 'http'
import { Server } from 'socket.io'
import { verifySecretToken } from '../util/jwtUtils'
import { getConfig } from '../util/EnvManager'

export const setupSocket = (server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => {
    const io = new Server(server, {
        cors: {
            origin: getConfig().NODE_ENV !== 'production' ? '*' : undefined,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
    })


    // Auth Handler
    io.use((socket, next) => {
        try {
            const { jwt } = socket.handshake.auth
            if (!jwt) {
                return next(new Error('Unauthorized'))
            }
            socket.data.authClient = verifySecretToken(jwt)
        } catch (err) {
            return next(new Error('Unauthorized'))
        }


        next()
    })

    // Map of clients <clientId, socketId> which are currently online
    // client id can either be userId or deviceId
    const clients: Map<string, string> = new Map()

    io.on('connection', (socket) => {
        console.log('A user connected')
        console.log(socket.data.authClient)
        // Set or update client (client is online)
        clients.set(socket.data.authClient.id, socket.id)


        socket.on('callClient', (data) => {
            //ToDo check if client belongs to doorbell
            const clientToCall = data.to
            const clientToCallSocketId = clients.get(clientToCall)
            if (clientToCallSocketId) {
                io.to(clientToCallSocketId).emit('callClient', {
                    signal: data.signalData,
                    from: socket.data.authClient.id,
                    name: socket.data.authClient.name,
                })
                // else notify sender, that client is not online
            } else {
                io.to(socket.id).emit('callFailed', 'Client is not online')
            }

        })
        socket.on('answerCall', (data) => {
            const clientToCall = data.to
            const clientToCallSocketId = clients.get(clientToCall)
            if (clientToCallSocketId) {
                io.to(clientToCallSocketId).emit('callAccepted', data.signal)
            } else {
                io.to(socket.id).emit('callFailed', 'Client is not online')
            }

        })

        socket.on('leaveCall', (data)=> {
            const clientToCall = data.to
            const clientToCallSocketId = clients.get(clientToCall)
            if (clientToCallSocketId) {
                io.to(clientToCallSocketId).emit('callOver')
            } else {
                io.to(socket.id).emit('callFailed', 'Client is not online')
            }
        })

        socket.on('denyCall', (data) => {
            const clientToCall = data.to
            const clientToCallSocketId = clients.get(clientToCall)
            if(clientToCallSocketId) {
                io.to(clientToCallSocketId).emit('callDenied')
            } else  {
                io.to(socket.id).emit('callFailed', 'Client is not online')
            }
        })

        // On disconnect remove client from clients map
        socket.on('disconnect', function() {
            console.log('Got disconnect!')
            clients.delete(socket.data.authId)


        })
    })
}