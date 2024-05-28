import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@/base/api/AxiosClient.ts'
import { DeviceRegisterData } from '@/shared/types.ts'

export const useRegisterDeviceMutation = (data: DeviceRegisterData) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => AxiosClient.post('/devices/register', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices'] })
        },
    })
}
