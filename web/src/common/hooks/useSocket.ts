import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import useLocalStorage from '@/common/hooks/useLocalStorage.ts'

const getSocket = (jwt: string) => {
    const URL = import.meta.env.VITE_SERVER_SOCKET_URL
    return io(URL, {
        auth: { jwt: jwt },
    })
}

export function useSocket() {
    const token = useLocalStorage('token')
    const [socket, setSocket] = useState<Socket>()

    useEffect(() => {
        setSocket(getSocket(token ?? ''))
    }, [token])

    return socket
}
