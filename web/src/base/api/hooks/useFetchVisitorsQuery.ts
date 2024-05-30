import { DeviceId } from '@/shared/types.ts'
import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/base/api/AxiosClient.ts'
import { ApiVisitor } from '@/common/types/api-types.ts'

export const useFetchVisitorsQuery = (data: Partial<DeviceId>) => {
    return useQuery({
        queryKey: ['visitors', data.id],
        queryFn: ({ signal }) =>
            AxiosClient.get<ApiVisitor[]>(`/devices/${data.id}/visitors`, {
                signal,
            }).then((res) => res.data),
        enabled: !!data.id,
    })
}
