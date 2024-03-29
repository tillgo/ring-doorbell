import {io} from "socket.io-client";


const URL = import.meta.env.VITE_SERVER_SOCKET_URL

// ToDo: Auto Connect is currently set to false, we will se if this should change in the future
export const socket = io(URL, {
    autoConnect: false
})