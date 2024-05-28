import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/base/api/AxiosClient.ts'
import { Device } from '@/shared/types.ts'

export const useFetchMyDevicesQuery = () => {
    return useQuery({
        queryKey: ['devices'],
        queryFn: ({ signal }) =>
            AxiosClient.get<Device[]>('/devices/me', { signal }).then((res) => res.data),
    })
}
