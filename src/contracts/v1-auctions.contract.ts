import { z } from "zod";
import { oc } from "@orpc/contract";

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
      query: z.object({status: z.enum(["Cancelled","Closed","Open"]).nullish(), "seller-id": z.string().uuid().nullish(), "sort-by": z.enum(["CreatedAt","EndsAt","StartingPrice"]).nullish(), "sort-dir": z.enum(["Asc","Desc"]).nullish(), limit: z.number().int().nullish(), offset: z.number().int().nullish()}).optional()
    }))
    .output(z.object({
        "items": z.array(z.object({
        "appellation": z.string(),
        "bottleCount": z.number().int(),
        "bottleSize": z.enum(["DoubleMagnum","Half","Jeroboam","Magnum","Other","Standard"]),
        "color": z.enum(["Dessert","Fortified","Orange","Red","Rose","Sparkling","White"]),
        "currency": z.string(),
        "currentPrice": z.number(),
        "description": z.string().nullish(),
        "endsAt": z.string().datetime({ offset: true }),
        "id": z.string().uuid(),
        "producerName": z.string(),
        "rating": z.object({
        "rating": z.number(),
        "ratingsCount": z.number().int()}).nullish(),
        "region": z.string(),
        "sellerId": z.string().uuid(),
        "startingPrice": z.number(),
        "startsAt": z.string().datetime({ offset: true }),
        "status": z.enum(["Cancelled","Closed","Open"]),
        "vintage": z.number().int().nullish(),
        "wineName": z.string()})),
        "limit": z.number().int(),
        "offset": z.number().int(),
        "total": z.number().int()})),
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
      body: z.object({
        "appellation": z.string(),
        "bottleCount": z.number().int(),
        "bottleSize": z.enum(["DoubleMagnum","Half","Jeroboam","Magnum","Other","Standard"]),
        "color": z.enum(["Dessert","Fortified","Orange","Red","Rose","Sparkling","White"]),
        "currency": z.string(),
        "description": z.string().nullish(),
        "endsAt": z.string().datetime({ offset: true }),
        "producerName": z.string(),
        "region": z.string(),
        "startingPrice": z.number(),
        "startsAt": z.string().datetime({ offset: true }),
        "vintage": z.number().int().nullish(),
        "wineName": z.string()})
    }))
    .output(z.object({
        "appellation": z.string(),
        "bottleCount": z.number().int(),
        "bottleSize": z.enum(["DoubleMagnum","Half","Jeroboam","Magnum","Other","Standard"]),
        "color": z.enum(["Dessert","Fortified","Orange","Red","Rose","Sparkling","White"]),
        "currency": z.string(),
        "currentPrice": z.number(),
        "description": z.string().nullish(),
        "endsAt": z.string().datetime({ offset: true }),
        "id": z.string().uuid(),
        "producerName": z.string(),
        "rating": z.object({
        "rating": z.number(),
        "ratingsCount": z.number().int()}).nullish(),
        "region": z.string(),
        "sellerId": z.string().uuid(),
        "startingPrice": z.number(),
        "startsAt": z.string().datetime({ offset: true }),
        "status": z.enum(["Cancelled","Closed","Open"]),
        "vintage": z.number().int().nullish(),
        "wineName": z.string()}))
    .errors({
      'result:invalid-window': {
        status: 400,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
