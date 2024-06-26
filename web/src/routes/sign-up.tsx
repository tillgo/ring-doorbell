import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Input } from '@/lib/components/ui/input.tsx'
import { Button } from '@/lib/components/ui/button.tsx'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginData, LoginSchema } from '@/shared/types'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/lib/components/ui/form.tsx'
import { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/lib/components/ui/card.tsx'
import { signUp } from '@/base/api/queries/auth.ts'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/sign-up')({
    component: SignUp,
})

export function SignUp() {
    const [submitError, setSubmitError] = useState('')

    const navigate = useNavigate()

    const form = useForm<LoginData>({
        mode: 'onSubmit',
        resolver: zodResolver(LoginSchema),
        defaultValues: { username: '', password: '' },
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit: SubmitHandler<LoginData> = async (formData) => {
        try {
            const { data } = await signUp(formData)

            localStorage.setItem('token', data.token)
            localStorage.setItem('refreshToken', data.refreshToken)

            await navigate({ to: '/', params: {} })
        } catch (error) {
            form.reset()
            if (error instanceof AxiosError && error?.response?.data?.message)
                setSubmitError(error.response.data.message)
            console.error(error)
        }
    }

    return (
        <div className="flex h-full justify-center md:mt-12">
            <Form {...form}>
                <form
                    onChange={() => {
                        if (submitError) setSubmitError('')
                    }}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col justify-center"
                >
                    <Card className="max-w-[350px]">
                        <CardHeader>
                            <CardTitle className="text-2xl">Sign Up</CardTitle>
                            <CardDescription>
                                Enter a username below to create your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Username"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {submitError && <FormMessage>{submitError}</FormMessage>}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {!isLoading ? (
                                        'Sign Up'
                                    ) : (
                                        <Loader2 className={'animate-spin'} />
                                    )}
                                </Button>
                                <div className="text-center text-sm">
                                    Have an account already?{' '}
                                    <Link to={'/login'} className="underline">
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    )
}
