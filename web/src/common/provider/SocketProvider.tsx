import { createContext, useEffect, useState, JSX } from 'react'
import { io, Socket } from 'socket.io-client'
import useLocalStorage from '@/common/hooks/useLocalStorage.ts'

export const SocketContext = createContext<Socket | undefined>(undefined)

const getSocket = (jwt: string) => {
    const URL = import.meta.env.VITE_SERVER_SOCKET_URL
    return io(URL, {
        autoConnect: true,
        auth: { jwt: jwt },
    })
}

const SocketProvider = (props: { children: JSX.Element }) => {
    const token = useLocalStorage('token')
    const [socket, setSocket] = useState<Socket | undefined>(undefined)

    useEffect(() => {
        const socket = getSocket(token ?? '')
        setSocket(socket)

        return () => {
            socket.disconnect()
        }
    }, [token])

    return <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
}

export default SocketProvider
