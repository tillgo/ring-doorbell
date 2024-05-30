import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DeleteVisitorData } from '@/shared/types.ts'
import { AxiosClient } from '@/base/api/AxiosClient.ts'

export const useDeleteVisitorMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DeleteVisitorData) =>
            AxiosClient.delete(`/devices/${data.deviceId}/visitors/${data.visitorId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['visitors'] })
        },
    })
}
