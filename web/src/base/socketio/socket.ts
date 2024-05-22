import { io } from 'socket.io-client'

const URL = import.meta.env.VITE_SERVER_SOCKET_URL
console.log(URL)
// ToDo: Auto Connect is currently set to true, we will se if this should change in the future
export const socket = io(URL, {
    autoConnect: true,
})
