import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddHouseholdMemberData } from '@/shared/types.ts'
import { AxiosClient } from '@/base/api/AxiosClient.ts'

export const useAddHouseholdMemberMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ deviceId, ...data }: AddHouseholdMemberData & { deviceId: string }) =>
            AxiosClient.post(`/devices/${deviceId}/household-members`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['household-members'] })
        },
    })
}
