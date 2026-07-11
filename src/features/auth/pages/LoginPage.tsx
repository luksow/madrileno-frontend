import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { client } from '@/api/orpc'
import { problemFrom, type Problem } from '@/api/problem'
import { tokenStore } from '@/features/auth/tokenStore'
import { Button } from '@/ui/button'
import { Field } from '@/ui/field'
import { Input } from '@/ui/input'

const loginSchema = z.object({ email: z.string().email('Enter a valid email address') })
type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const [problem, setProblem] = useState<Problem | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = handleSubmit(async ({ email }) => {
    setProblem(null)
    try {
      const res = await client.v1.auth.dev.post({ body: { email } })
      tokenStore.set({ jwt: res.jwt, refreshToken: res.refreshToken, email })
      void navigate('/')
    } catch (error) {
      setProblem(
        problemFrom(error) ?? {
          type: 'unknown',
          status: 0,
          title: 'Login failed — is the backend up?',
        },
      )
    }
  })

  return (
    <section className="mx-auto flex max-w-sm flex-col gap-6 py-12">
      <title>Log in — madrileno</title>
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Log in</h1>
        <p className="text-sm text-muted-foreground">
          Dev login: any email works when the backend runs with <code>DEV_AUTH_ENABLED=true</code>.
        </p>
      </header>

      <form onSubmit={(e) => void onSubmit(e)} noValidate className="flex flex-col gap-4">
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
        </Field>

        {problem && (
          <p className="text-sm text-destructive" role="alert">
            {problem.title}
            {problem.detail != null ? ` — ${problem.detail}` : ''}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </section>
  )
}
