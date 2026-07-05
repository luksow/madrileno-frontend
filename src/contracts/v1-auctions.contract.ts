import { z } from "zod";
import { oc } from "@orpc/contract";
import { auctionDtoSchema, createAuctionRequestSchema, pageSchema } from "./schemas";

export const v1AuctionsContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/v1/auctions',
      summary: 'Unauthenticated: a page of auctions, optionally filtered and sorted',
      description: 'List auctions (paginated). Filter by status / seller; page with `limit` (1–100, default 20) + `offset`; sort by `CreatedAt` / `EndsAt` / `StartingPrice`, `Asc` / `Desc` (default `CreatedAt` `Desc`), with `id` as a stable tie-break.',
      tags: ['Auctions'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      query: z.object({status: z.enum(["Cancelled","Closed","Open"]).nullish(), "seller-id": z.uuid().nullish(), "sort-by": z.enum(["CreatedAt","EndsAt","StartingPrice"]).nullish(), "sort-dir": z.enum(["Asc","Desc"]).nullish(), limit: z.number().int().nullish(), offset: z.number().int().nullish()}).optional()
    }))
    .output(pageSchema),
  post: oc
    .route({
      method: 'POST',
      path: '/v1/auctions',
      summary: 'Authenticated seller opens a new wine auction',
      description: 'Create a new auction',
      tags: ['Auctions'],
      successStatus: 201,
      inputStructure: 'detailed'
    })
    .input(z.object({
      body: createAuctionRequestSchema
    }))
    .output(auctionDtoSchema)
    .errors({
      'result:invalid-window': {
        status: 400,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:invalid-window"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
