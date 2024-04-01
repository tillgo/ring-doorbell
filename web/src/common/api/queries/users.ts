import { AxiosClient } from '@/common/api/AxiosClient.ts'
import { User } from '@/shared/types.ts'

export const fetchMyUser = () => AxiosClient.get<User>('/users/me').then((res) => res.data)
