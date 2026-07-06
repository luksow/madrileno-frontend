import { z } from 'zod'

// RFC 9457 Problem Details; dispatch on `type`, never on the human-readable text.
export const problemSchema = z.object({
  type: z.string(),
  status: z.number().int(),
  title: z.string(),
  detail: z.string().nullish(),
  instance: z.string().nullish(),
})

export type Problem = z.infer<typeof problemSchema>

export function asProblem(body: unknown): Problem | null {
  const result = problemSchema.safeParse(body)
  return result.success ? result.data : null
}

export function problemTag(problem: Problem): string {
  return problem.type.split(':').pop() ?? problem.type
}

export class ApiError extends Error {
  readonly status: number
  readonly problem: Problem | null

  constructor(status: number, problem: Problem | null) {
    super(problem?.title ?? `API error (${status})`)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }
}
