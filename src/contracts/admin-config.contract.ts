import { z } from "zod";
import { oc } from "@orpc/contract";
import { errorSchema } from "./schemas";

export const adminConfigContract = {
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
        data: errorSchema
      }
    })
};
