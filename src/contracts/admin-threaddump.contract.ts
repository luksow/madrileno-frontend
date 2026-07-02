import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const adminThreaddumpContract = initContract().router({
  get: {
    summary: 'Inspect JVM threads + cats-effect fibers',
    description: 'Returns a snapshot of the JVM thread state (Spring-Actuator shape) alongside the cats-effect live fiber snapshot. Use this for \'what is this process stuck doing?\' debugging. `jvmThreads` exposes non-fiber threads (Netty I/O, Skunk pool, scheduler, finalizer); `fibers.workers` shows fibers queued on each compute worker, `fibers.external` shows suspended fibers (Deferred.get, Sleep, etc.). Fiber traces depend on `-Dcats.effect.tracing.mode` — default `cached` populates them with the captured async-boundary frames.',
    method: 'GET',
    path: '/admin/threaddump',
    responses: {
      200: z.object({}),
      401: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
