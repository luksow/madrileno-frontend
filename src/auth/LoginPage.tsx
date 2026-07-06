import { zodResolver } from '@hookform/resolvers/zod'
import { ORPCError } from '@orpc/client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { client } from '@/api/orpc'
import { asProblem, type Problem } from '@/api/problem'
import { tokenStore } from './tokenStore'

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
      const problem = error instanceof ORPCError ? asProblem(error.data) : null
      setProblem(
        problem ?? { type: 'unknown', status: 0, title: 'Login failed — is the backend up?' },
      )
    }
  })

  return (
    <section className="narrow">
      <title>Log in — madrileno</title>
      <h1>Log in</h1>
      <p className="muted">
        Dev login: any email works when the backend runs with <code>DEV_AUTH_ENABLED=true</code>.
      </p>
      <form onSubmit={(e) => void onSubmit(e)} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
        {problem && (
          <p className="error">
            {problem.title}
            {problem.detail != null ? ` — ${problem.detail}` : ''}
          </p>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </section>
  )
}
