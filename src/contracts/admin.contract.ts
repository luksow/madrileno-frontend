import { z } from "zod";
import { oc } from "@orpc/contract";
import { errorSchema } from "./schemas";
import { createFlagRequestSchema, createSegmentRequestSchema, depCheckSchema, evaluateFlagRequestSchema, featureFlagDtoSchema, featureFlagDtoSchema4496, loggerLevelDtoSchema, segmentDtoSchema, setLoggerLevelRequestSchema, toggleFlagRequestSchema, updateFlagRequestSchema, updateSegmentRequestSchema } from "./admin.schemas";

export const admin = {
  config: {
    get: oc
      .route({
        method: 'GET',
        path: '/admin/config',
        summary: 'Inspect merged configuration',
        description: 'Returns the merged application configuration (HOCON resolved against env vars) as a JSON tree. Leaf values whose key name contains `password`, `passphrase`, `secret`, `credential`, `access-key`, `api-key`, `private-key`, or `token` are replaced with `"[REDACTED]"`. Project-specific secrets can be added via `admin.config.redacted-paths`.',
        tags: ['Admin'],
        successStatus: 200,
        inputStructure: 'detailed'
      })
      .output(z.object({}))
      .errors({
        'rejection:authentication-failed': {
          status: 401,
          data: errorSchema.extend({type: z.enum(["rejection:authentication-failed"]).describe("A URI reference identifying the problem type")})
        }
      })
  },
  featureFlagSegments: {
    get: oc
      .route({
        method: 'GET',
        path: '/admin/feature-flag-segments',
        summary: 'List segments',
        description: 'List all segments.',
        tags: ['Admin'],
        successStatus: 200,
        inputStructure: 'detailed'
      })
      .output(z.array(segmentDtoSchema)),
    post: oc
      .route({
        method: 'POST',
        path: '/admin/feature-flag-segments',
        summary: 'Create a segment',
        description: 'Create a reusable segment referenced from rules via SegmentMatch.',
        tags: ['Admin'],
        successStatus: 201,
        inputStructure: 'detailed'
      })
      .input(z.object({
        body: createSegmentRequestSchema
      }))
      .output(segmentDtoSchema)
      .errors({
        'result:segment-name-exists': {
          status: 409,
          data: errorSchema.extend({type: z.enum(["result:segment-name-exists"]).describe("A URI reference identifying the problem type")})
        }
      }),
    byName: {
      delete: oc
        .route({
          method: 'DELETE',
          path: '/admin/feature-flag-segments/{name}',
          summary: 'Delete a segment',
          description: 'Delete a segment. Rules still referencing it stop matching (missing segment never matches).',
          tags: ['Admin'],
          successStatus: 204,
          inputStructure: 'detailed'
        })
        .input(z.object({
          params: z.object({name: z.string()})
        }))
        .output(z.void())
        .errors({
          'result:segment-not-found': {
            status: 404,
            data: errorSchema.extend({type: z.enum(["result:segment-not-found"]).describe("A URI reference identifying the problem type")})
          }
        }),
      put: oc
        .route({
          method: 'PUT',
          path: '/admin/feature-flag-segments/{name}',
          summary: 'Update a segment',
          description: 'Replace a segment\'s description and conditions. Name, id and createdAt are preserved.',
          tags: ['Admin'],
          successStatus: 200,
          inputStructure: 'detailed'
        })
        .input(z.object({
          params: z.object({name: z.string()}),
          body: updateSegmentRequestSchema
        }))
        .output(segmentDtoSchema)
        .errors({
          'result:segment-not-found': {
            status: 404,
            data: errorSchema.extend({type: z.enum(["result:segment-not-found"]).describe("A URI reference identifying the problem type")})
          }
        })
    }
  },
  featureFlags: {
    get: oc
      .route({
        method: 'GET',
        path: '/admin/feature-flags',
        summary: 'List feature flags',
        description: 'List all feature flags with their rules.',
        tags: ['Admin'],
        successStatus: 200,
        inputStructure: 'detailed'
      })
      .output(z.array(featureFlagDtoSchema4496))
      .errors({
        'rejection:authentication-failed': {
          status: 401,
          data: errorSchema.extend({type: z.enum(["rejection:authentication-failed"]).describe("A URI reference identifying the problem type")})
        }
      }),
    post: oc
      .route({
        method: 'POST',
        path: '/admin/feature-flags',
        summary: 'Create a feature flag',
        description: 'Create a feature flag. The key is immutable; rules are validated against the flag\'s variant type.',
        tags: ['Admin'],
        successStatus: 201,
        inputStructure: 'detailed'
      })
      .input(z.object({
        body: createFlagRequestSchema
      }))
      .output(featureFlagDtoSchema4496)
      .errors({
        'result:flag-invalid': {
          status: 400,
          data: errorSchema.extend({type: z.enum(["result:flag-invalid"]).describe("A URI reference identifying the problem type")})
        },
        'result:flag-key-exists': {
          status: 409,
          data: errorSchema.extend({type: z.enum(["result:flag-key-exists"]).describe("A URI reference identifying the problem type")})
        }
      }),
    byKey: {
      delete: oc
        .route({
          method: 'DELETE',
          path: '/admin/feature-flags/{key}',
          summary: 'Delete a feature flag',
          description: 'Delete a flag and its rules. Audit entries survive with the flag reference detached.',
          tags: ['Admin'],
          successStatus: 204,
          inputStructure: 'detailed'
        })
        .input(z.object({
          params: z.object({key: z.string()})
        }))
        .output(z.void())
        .errors({
          'result:flag-not-found': {
            status: 404,
            data: errorSchema.extend({type: z.enum(["result:flag-not-found"]).describe("A URI reference identifying the problem type")})
          }
        }),
      get: oc
        .route({
          method: 'GET',
          path: '/admin/feature-flags/{key}',
          summary: 'Get a feature flag',
          description: 'Fetch one feature flag by key.',
          tags: ['Admin'],
          successStatus: 200,
          inputStructure: 'detailed'
        })
        .input(z.object({
          params: z.object({key: z.string()})
        }))
        .output(featureFlagDtoSchema4496)
        .errors({
          'result:flag-not-found': {
            status: 404,
            data: errorSchema.extend({type: z.enum(["result:flag-not-found"]).describe("A URI reference identifying the problem type")})
          }
        }),
      put: oc
        .route({
          method: 'PUT',
          path: '/admin/feature-flags/{key}',
          summary: 'Update a feature flag',
          description: 'Replace a flag\'s mutable fields (description, enabled, default value, client exposure, rules). Key, id and createdAt are preserved.',
          tags: ['Admin'],
          successStatus: 200,
          inputStructure: 'detailed'
        })
        .input(z.object({
          params: z.object({key: z.string()}),
          body: updateFlagRequestSchema
        }))
        .output(featureFlagDtoSchema4496)
        .errors({
          'result:flag-not-found': {
            status: 404,
            data: errorSchema.extend({type: z.enum(["result:flag-not-found"]).describe("A URI reference identifying the problem type")})
          }
        }),
      audit: {
        get: oc
          .route({
            method: 'GET',
            path: '/admin/feature-flags/{key}/audit',
            summary: 'List a flag\'s audit entries',
            description: 'Audit trail for a flag (paginated, newest first by default). Entries survive flag deletion.',
            tags: ['Admin'],
            successStatus: 200,
            inputStructure: 'detailed'
          })
          .input(z.object({
            params: z.object({key: z.string()}),
            query: z.object({"sort-by": z.enum(["CreatedAt"]).nullish(), "sort-dir": z.enum(["Asc","Desc"]).nullish(), limit: z.number().int().nullish(), offset: z.number().int().nullish()}).optional()
          }))
          .output(z.object({
              "items": z.array(z.object({
              "action": z.enum(["Created","Deleted","Toggled","Updated"]),
              "actor": z.string(),
              "after": featureFlagDtoSchema.nullish(),
              "before": featureFlagDtoSchema.nullish(),
              "createdAt": z.iso.datetime({ offset: true }),
              "flagId": z.uuid().nullish(),
              "flagKey": z.string(),
              "id": z.uuid()})),
              "limit": z.number().int(),
              "offset": z.number().int(),
              "total": z.number().int()}))
      },
      evaluate: {
        post: oc
          .route({
            method: 'POST',
            path: '/admin/feature-flags/{key}/evaluate',
            summary: 'Evaluate a flag for a given context',
            description: 'Dry-run a flag against an arbitrary evaluation context, bypassing caches. For debugging targeting rules.',
            tags: ['Admin'],
            successStatus: 200,
            inputStructure: 'detailed'
          })
          .input(z.object({
            params: z.object({key: z.string()}),
            body: evaluateFlagRequestSchema
          }))
          .output(z.object({
              "reason": z.enum(["Default","Disabled","Error","Split","TargetingMatch"]),
              "value": z.object({})}))
          .errors({
            'result:flag-not-found': {
              status: 404,
              data: errorSchema.extend({type: z.enum(["result:flag-not-found"]).describe("A URI reference identifying the problem type")})
            }
          })
      },
      toggle: {
        post: oc
          .route({
            method: 'POST',
            path: '/admin/feature-flags/{key}/toggle',
            summary: 'Toggle a feature flag',
            description: 'Enable or disable a flag without touching its rules.',
            tags: ['Admin'],
            successStatus: 200,
            inputStructure: 'detailed'
          })
          .input(z.object({
            params: z.object({key: z.string()}),
            body: toggleFlagRequestSchema
          }))
          .output(featureFlagDtoSchema4496)
          .errors({
            'result:flag-not-found': {
              status: 404,
              data: errorSchema.extend({type: z.enum(["result:flag-not-found"]).describe("A URI reference identifying the problem type")})
            }
          })
      }
    }
  },
  healthCheck: {
    get: oc
      .route({
        method: 'GET',
        path: '/admin/health-check',
        summary: 'Admin readiness probe',
        description: 'Admin-only deep health check — probes Postgres and SMTP, returns 503 if any dep is down. Gated by Basic Auth.',
        tags: ['Admin'],
        successStatus: 200,
        inputStructure: 'detailed'
      })
      .output(z.object({
          "postgres": depCheckSchema,
          "smtp": depCheckSchema,
          "status": z.enum(["Down","Up"])}))
      .errors({
        'rejection:authentication-failed': {
          status: 401,
          data: errorSchema.extend({type: z.enum(["rejection:authentication-failed"]).describe("A URI reference identifying the problem type")})
        }
      })
  },
  heapdump: {
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
          data: errorSchema.extend({type: z.enum(["rejection:authentication-failed"]).describe("A URI reference identifying the problem type")})
        }
      })
  },
  loggers: {
    get: oc
      .route({
        method: 'GET',
        path: '/admin/loggers',
        summary: 'Inspect Logback loggers',
        description: 'List all configured loggers with their effective and configured levels.',
        tags: ['Admin'],
        successStatus: 200,
        inputStructure: 'detailed'
      })
      .output(z.array(loggerLevelDtoSchema))
      .errors({
        'rejection:authentication-failed': {
          status: 401,
          data: errorSchema.extend({type: z.enum(["rejection:authentication-failed"]).describe("A URI reference identifying the problem type")})
        }
      }),
    byName: {
      get: oc
        .route({
          method: 'GET',
          path: '/admin/loggers/{name}',
          summary: 'Inspect one Logback logger',
          description: 'Get one logger\'s configured + effective level. 404 if Logback has never been told about the name.',
          tags: ['Admin'],
          successStatus: 200,
          inputStructure: 'detailed'
        })
        .input(z.object({
          params: z.object({name: z.string()})
        }))
        .output(loggerLevelDtoSchema)
        .errors({
          'result:logger-not-found': {
            status: 404,
            data: errorSchema.extend({type: z.enum(["result:logger-not-found"]).describe("A URI reference identifying the problem type")})
          }
        }),
      post: oc
        .route({
          method: 'POST',
          path: '/admin/loggers/{name}',
          summary: 'Set a Logback logger\'s level',
          description: 'Set a logger\'s configured level. Send `{"level":"DEBUG"}` to set; `{"level":null}` (or `{}`) to clear and inherit from parent. 404 if the logger doesn\'t exist — Logback only knows about a logger after something has named it.',
          tags: ['Admin'],
          successStatus: 200,
          inputStructure: 'detailed'
        })
        .input(z.object({
          params: z.object({name: z.string()}),
          body: setLoggerLevelRequestSchema
        }))
        .output(loggerLevelDtoSchema)
        .errors({
          'rejection:authentication-failed': {
            status: 401,
            data: errorSchema.extend({type: z.enum(["rejection:authentication-failed"]).describe("A URI reference identifying the problem type")})
          },
          'result:invalid-log-level': {
            status: 400,
            data: errorSchema.extend({type: z.enum(["result:invalid-log-level"]).describe("A URI reference identifying the problem type")})
          },
          'result:logger-not-found': {
            status: 404,
            data: errorSchema.extend({type: z.enum(["result:logger-not-found"]).describe("A URI reference identifying the problem type")})
          }
        })
    }
  },
  threaddump: {
    get: oc
      .route({
        method: 'GET',
        path: '/admin/threaddump',
        summary: 'Inspect JVM threads + cats-effect fibers',
        description: 'Returns a snapshot of the JVM thread state (Spring-Actuator shape) alongside the cats-effect live fiber snapshot. Use this for \'what is this process stuck doing?\' debugging. `jvmThreads` exposes non-fiber threads (Netty I/O, Skunk pool, scheduler, finalizer); `fibers.workers` shows fibers queued on each compute worker, `fibers.external` shows suspended fibers (Deferred.get, Sleep, etc.). Fiber traces depend on `-Dcats.effect.tracing.mode` — default `cached` populates them with the captured async-boundary frames.',
        tags: ['Admin'],
        successStatus: 200,
        inputStructure: 'detailed'
      })
      .output(z.object({}))
      .errors({
        'rejection:authentication-failed': {
          status: 401,
          data: errorSchema.extend({type: z.enum(["rejection:authentication-failed"]).describe("A URI reference identifying the problem type")})
        }
      })
  }
};
