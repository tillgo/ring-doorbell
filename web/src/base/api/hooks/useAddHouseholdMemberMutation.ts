import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddHouseholdMemberData } from '@/shared/types.ts'
import { AxiosClient } from '@/base/api/AxiosClient.ts'

export const useAddHouseholdMemberMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: AddHouseholdMemberData) =>
            AxiosClient.post('/devices/household-members', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['household-members'] })
        },
    })
}
