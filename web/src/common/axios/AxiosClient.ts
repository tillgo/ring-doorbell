import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const AxiosClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})

AxiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const oldToken = localStorage.getItem('token')
                const refreshToken = localStorage.getItem('refreshToken')

                if (!oldToken || !refreshToken) {
                    return Promise.reject(error)
                }

                const decoded = jwtDecode(oldToken) as { id: string }

                const response = await axios.post('/api/auth/refresh-token', { refreshToken, userId: decoded.id })
                const { token } = response.data

                localStorage.setItem('token', token)

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${token}`
                return axios(originalRequest)
            } catch (error) {
                // TODO: Handle refresh token error or redirect to login
            }
        }

        return Promise.reject(error)
    },
)