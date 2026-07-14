import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { client } from '@/api/orpc'
import { problemFrom, type Problem } from '@/api/problem'
import { m } from '@/paraglide/messages'
import { tokenStore } from '@/features/auth/tokenStore'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const loginSchema = z.object({ email: z.string().email(m.login_email_invalid()) })
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
          title: m.login_failed(),
        },
      )
    }
  })

  return (
    <section className="mx-auto flex max-w-sm flex-col gap-6 py-12">
      <title>{m.login_page_title()}</title>
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{m.login_heading()}</h1>
        <p className="text-sm text-muted-foreground">
          {m.login_hint_before()}
          <code>DEV_AUTH_ENABLED=true</code>.
        </p>
      </header>

      <form onSubmit={(e) => void onSubmit(e)} noValidate className="flex flex-col gap-4">
        <Field data-invalid={errors.email !== undefined}>
          <FieldLabel htmlFor="email">{m.login_email_label()}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={errors.email !== undefined}
            {...register('email')}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        {problem && (
          <p className="text-sm text-destructive" role="alert">
            {problem.title}
            {problem.detail != null ? ` — ${problem.detail}` : ''}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? m.login_submitting() : m.login_submit()}
        </Button>
      </form>
    </section>
  )
}
