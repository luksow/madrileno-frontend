import { errorSchema, type ErrorType } from '@/contracts/schemas'

// RFC 9457 Problem Details; dispatch on `type`, never on the human-readable text.
export type Problem = ErrorType

export function asProblem(body: unknown): Problem | null {
  const result = errorSchema.safeParse(body)
  return result.success ? result.data : null
}

export function problemTag(problem: Problem): string {
  return problem.type.split(':').pop() ?? problem.type
}
