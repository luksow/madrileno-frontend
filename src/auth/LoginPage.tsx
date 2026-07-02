import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { makeClient } from '../api/client'
import { asProblem, type Problem } from '../api/problem'
import { devAuthContract } from './devAuth.contract'
import { tokenStore } from './tokenStore'

const loginSchema = z.object({ email: z.string().email('Enter a valid email address') })
type LoginForm = z.infer<typeof loginSchema>

const devAuth = makeClient(devAuthContract)

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
    const res = await devAuth.post({ body: { email } })
    if (res.status === 200) {
      tokenStore.set({ jwt: res.body.jwt, refreshToken: res.body.refreshToken, email })
      void navigate('/')
      return
    }
    setProblem(
      asProblem(res.body) ?? {
        type: 'unknown',
        status: res.status,
        title: `Login failed (${String(res.status)})`,
      },
    )
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
