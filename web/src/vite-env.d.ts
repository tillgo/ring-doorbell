/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_SERVER_API_URL: string
    readonly VITE_SERVER_SOCKET_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
