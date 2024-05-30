import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DeleteHouseholdMemberData } from '@/shared/types.ts'
import { AxiosClient } from '@/base/api/AxiosClient.ts'

export const useDeleteHouseholdMemberMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DeleteHouseholdMemberData) =>
            AxiosClient.delete(`/devices/${data.deviceId}/household-members/${data.userId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['household-members'] })
        },
    })
}
