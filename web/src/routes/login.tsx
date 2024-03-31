import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginData, LoginSchema } from '@/shared/types'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx'
import { useState } from 'react'
import Loader from '@/app/general/components/Loader.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { signIn } from '@/common/api/queries/auth.ts'
import { AxiosError } from 'axios'

export const Route = createFileRoute('/login')({
    component: Login,
})

export function Login() {
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
            const { data } = await signIn(formData)

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
        <div className="flex h-screen justify-center p-6">
            <Form {...form}>
                <form
                    onChange={() => {
                        if (submitError) setSubmitError('')
                    }}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col justify-center"
                >
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                                Enter your username below to login to your account
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
                                    {!isLoading ? 'Login' : <Loader />}
                                </Button>
                                <div className="text-center text-sm">
                                    Dont have an account?{' '}
                                    <Link to={'/sign-up'} className="underline">
                                        Sign Up
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
