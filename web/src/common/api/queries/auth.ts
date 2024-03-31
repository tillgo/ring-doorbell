import { AxiosClient } from '@/common/api/AxiosClient.ts'
import { LoginData, User } from '@/shared/types.ts'

type LoginResponse = {
    user: User
    token: string
    refreshToken: string
}

export const signIn = (data: LoginData) => AxiosClient.post<LoginResponse>('/auth/sign-in', data)

export const signUp = (data: LoginData) => AxiosClient.post<LoginResponse>('/auth/sign-up', data)
