import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/base/api/AxiosClient.ts'
import { ApiDashboardData } from '@/common/types/api-types.ts'

export const useFetchDashboardDataQuery = () => {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: ({ signal }) =>
            AxiosClient.get<ApiDashboardData>('/dashboard', { signal }).then((res) => res.data),
        refetchInterval: 1000 * 15,
    })
}
