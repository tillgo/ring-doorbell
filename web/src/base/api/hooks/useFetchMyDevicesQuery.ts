import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/base/api/AxiosClient.ts'
import { ApiDevice } from '@/common/types/api-types.ts'

export const useFetchMyDevicesQuery = () => {
    return useQuery({
        queryKey: ['devices'],
        queryFn: ({ signal }) =>
            AxiosClient.get<ApiDevice[]>('/devices/me', { signal }).then((res) => res.data),
    })
}
