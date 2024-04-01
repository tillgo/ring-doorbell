import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useLocalStorage } from './useLocalStorage'

export function isAuthenticatedInitial() {
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')

    if (token) {
        const decodedToken = jwtDecode(token) as { id: string; username: string; exp: number }

        // if expired, but refresh token is available
        if (decodedToken.exp < Date.now() / 1000 && refreshToken) {
            const decodedRefreshToken = jwtDecode(refreshToken)
            return decodedRefreshToken.exp! >= Date.now() / 1000
        }

        return true
    } else {
        return false
    }
}

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(isAuthenticatedInitial)
    const [username, setUsername] = useState<string | null>(null)
    const token = useLocalStorage('token')
    const refreshToken = useLocalStorage('refreshToken')

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token) as { id: string; username: string; exp: number }

            // if expired, but refresh token is available
            if (decodedToken.exp < Date.now() / 1000 && refreshToken) {
                const decodedRefreshToken = jwtDecode(refreshToken)
                if (decodedRefreshToken.exp! < Date.now() / 1000) {
                    setUsername(null)
                    setIsAuthenticated(false)
                    return
                }

                setUsername(decodedToken.username)
                setIsAuthenticated(true)
                return
            }

            setUsername(decodedToken.username)
            setIsAuthenticated(true)
        } else {
            setUsername(null)
            setIsAuthenticated(false)
        }
    }, [token, refreshToken, setIsAuthenticated, setUsername])

    return { isAuthenticated, username }
}

export default useAuth