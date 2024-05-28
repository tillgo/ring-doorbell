import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/base/api/AxiosClient.ts'
import { User } from '@/shared/types.ts'

export const useMyUserQuery = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: ({ signal }) =>
            AxiosClient.get<User>('/users/me', { signal }).then((res) => res.data),
    })
}
