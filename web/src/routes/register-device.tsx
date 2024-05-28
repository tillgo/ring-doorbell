import { createFileRoute } from '@tanstack/react-router'
import { Scanner } from '@yudiel/react-qr-scanner'
import { SubmitHandler, useForm } from 'react-hook-form'
import { DeviceRegisterData, DeviceRegisterSchema } from '@/shared/types.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/lib/components/ui/form.tsx'
import { Input } from '@/lib/components/ui/input.tsx'
import { Button } from '@/lib/components/ui/button.tsx'
import { useState } from 'react'
import { useRegisterDeviceMutation } from '@/base/api/hooks/useRegisterDeviceMutation.ts'

type QrData = {
    identifier: string
    password: string
}

export const Route = createFileRoute('/register-device')({
    component: RegisterDevice,
})
function RegisterDevice() {
    const [isScanning, setIsScanning] = useState(true)

    const form = useForm<DeviceRegisterData>({
        mode: 'onSubmit',
        resolver: zodResolver(DeviceRegisterSchema),
        defaultValues: {
            identifier: '',
            nickname: '',
            password: '',
        },
    })
    const { mutate: registerDevice } = useRegisterDeviceMutation()

    const onSubmit: SubmitHandler<DeviceRegisterData> = async (formData) => {
        registerDevice({ ...formData, nickname: formData.nickname || undefined })

        //TODO: redirect to settings page
    }

    const handleScanQrCode = (text: string) => {
        const value: QrData = JSON.parse(text)

        if (!value.identifier || !value.password) return

        form.setValue('identifier', value.identifier)
        form.setValue('password', value.password)

        setIsScanning(false)
    }

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
            {isScanning && (
                <section className="w-full">
                    <Scanner
                        components={{ audio: false, tracker: true, torch: false }}
                        onResult={handleScanQrCode}
                    />
                </section>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Device UID</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Device Password</FormLabel>
                                <FormControl>
                                    <Input type={'password'} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nickname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nickname</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is an optional name to help you identify your device.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Register Device</Button>
                </form>
            </Form>
        </div>
    )
}
