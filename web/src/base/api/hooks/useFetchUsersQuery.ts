import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/base/api/AxiosClient.ts'
import { ApiUser } from '@/common/types/api-types.ts'

export const useFetchUsersQuery = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: ({ signal }) =>
            AxiosClient.get<ApiUser[]>('/users', { signal }).then((res) => res.data),
    })
}
