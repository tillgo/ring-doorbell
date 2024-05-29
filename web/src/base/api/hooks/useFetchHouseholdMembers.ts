import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/base/api/AxiosClient.ts'
import { ApiHouseholdMember } from '@/common/types/api-types.ts'
import { DeviceId } from '@/shared/types.ts'

export const useFetchHouseholdMembers = (data: Partial<DeviceId>) => {
    return useQuery({
        queryKey: ['household-members', data.id],
        queryFn: ({ signal }) =>
            AxiosClient.get<ApiHouseholdMember[]>(`/devices/${data.id}/household-members`, {
                signal,
            }).then((res) => res.data),
        enabled: !!data.id,
    })
}
