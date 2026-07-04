import { z } from "zod";
import { oc } from "@orpc/contract";

export const adminHeapdumpContract = {
  post: oc
    .route({
      method: 'POST',
      path: '/admin/heapdump',
      summary: 'Trigger an HPROF heap dump',
      description: 'Triggers an HPROF heap dump via `HotSpotDiagnosticMXBean.dumpHeap(...)`. The dump is written to a server-side path (not streamed in the response — heap dumps can be multi-GB). Returns the path, size, the `live` flag used, and how long the dump took. Operator workflow: hit this endpoint, then `scp` the file off the host and open in Eclipse MAT / VisualVM / jhat.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      query: z.object({live: z.boolean().nullish(), path: z.string().nullish()}).optional()
    }))
    .output(z.object({
        "liveOnly": z.boolean(),
        "path": z.string(),
        "sizeBytes": z.number().int(),
        "tookMillis": z.number().int()}))
    .errors({
      'rejection:authentication-failed': {
        status: 401,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
