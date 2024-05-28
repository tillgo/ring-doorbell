import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@/base/api/AxiosClient.ts'
import { DeviceRegisterData } from '@/shared/types.ts'

export const useRegisterDeviceMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DeviceRegisterData) => AxiosClient.post('/devices/register', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices'] })
        },
    })
}
