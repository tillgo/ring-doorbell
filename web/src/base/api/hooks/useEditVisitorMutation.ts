import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditVisitorData, SelectVisitorData } from '@/shared/types.ts'
import { AxiosClient } from '@/base/api/AxiosClient.ts'

export const useEditVisitorMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ deviceId, visitorId, ...data }: SelectVisitorData & EditVisitorData) =>
            AxiosClient.put(`/devices/${deviceId}/visitors/${visitorId}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['visitors'] })
        },
    })
}
