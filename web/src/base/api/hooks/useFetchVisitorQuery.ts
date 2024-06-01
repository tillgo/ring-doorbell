import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/base/api/AxiosClient.ts'
import { ApiVisitor } from '@/common/types/api-types.ts'

export const useFetchVisitorQuery = (visitorId: string) => {
    return useQuery({
        queryKey: ['visitors', visitorId],
        queryFn: ({ signal }) =>
            AxiosClient.get<ApiVisitor>(`/dashboard/visitors/${visitorId}`, { signal }).then(
                (res) => res.data
            ),
    })
}
