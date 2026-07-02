import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuctionsContract = initContract().router({
  get: {
    summary: 'Unauthenticated: a page of auctions, optionally filtered and sorted',
    description: 'List auctions (paginated). Filter by status / seller; page with `limit` (1–100, default 20) + `offset`; sort by `CreatedAt` / `EndsAt` / `StartingPrice`, `Asc` / `Desc` (default `CreatedAt` `Desc`), with `id` as a stable tie-break.',
    method: 'GET',
    path: '/v1/auctions',
    query: z.object({status: z.enum(["Cancelled","Closed","Open"]).nullish(), "seller-id": z.string().uuid().nullish(), "sort-by": z.enum(["CreatedAt","EndsAt","StartingPrice"]).nullish(), "sort-dir": z.enum(["Asc","Desc"]).nullish(), limit: z.number().int().nullish(), offset: z.number().int().nullish()}),
    responses: {
      200: z.object({
        "items": z.array(z.object({
        "appellation": z.string(),
        "bottleCount": z.number().int(),
        "bottleSize": z.enum(["DoubleMagnum","Half","Jeroboam","Magnum","Other","Standard"]),
        "color": z.enum(["Dessert","Fortified","Orange","Red","Rose","Sparkling","White"]),
        "currency": z.string(),
        "currentPrice": z.number(),
        "description": z.string().nullish(),
        "endsAt": z.coerce.date(),
        "id": z.string().uuid(),
        "producerName": z.string(),
        "rating": z.object({
        "rating": z.number(),
        "ratingsCount": z.number().int()}).nullish(),
        "region": z.string(),
        "sellerId": z.string().uuid(),
        "startingPrice": z.number(),
        "startsAt": z.coerce.date(),
        "status": z.enum(["Cancelled","Closed","Open"]),
        "vintage": z.number().int().nullish(),
        "wineName": z.string()})),
        "limit": z.number().int(),
        "offset": z.number().int(),
        "total": z.number().int()})
    }
  },
  post: {
    summary: 'Authenticated seller opens a new wine auction',
    description: 'Create a new auction',
    method: 'POST',
    path: '/v1/auctions',
    body: z.object({
        "appellation": z.string(),
        "bottleCount": z.number().int(),
        "bottleSize": z.enum(["DoubleMagnum","Half","Jeroboam","Magnum","Other","Standard"]),
        "color": z.enum(["Dessert","Fortified","Orange","Red","Rose","Sparkling","White"]),
        "currency": z.string(),
        "description": z.string().nullish(),
        "endsAt": z.coerce.date(),
        "producerName": z.string(),
        "region": z.string(),
        "startingPrice": z.number(),
        "startsAt": z.coerce.date(),
        "vintage": z.number().int().nullish(),
        "wineName": z.string()}),
    responses: {
      201: z.object({
        "appellation": z.string(),
        "bottleCount": z.number().int(),
        "bottleSize": z.enum(["DoubleMagnum","Half","Jeroboam","Magnum","Other","Standard"]),
        "color": z.enum(["Dessert","Fortified","Orange","Red","Rose","Sparkling","White"]),
        "currency": z.string(),
        "currentPrice": z.number(),
        "description": z.string().nullish(),
        "endsAt": z.coerce.date(),
        "id": z.string().uuid(),
        "producerName": z.string(),
        "rating": z.object({
        "rating": z.number(),
        "ratingsCount": z.number().int()}).nullish(),
        "region": z.string(),
        "sellerId": z.string().uuid(),
        "startingPrice": z.number(),
        "startsAt": z.coerce.date(),
        "status": z.enum(["Cancelled","Closed","Open"]),
        "vintage": z.number().int().nullish(),
        "wineName": z.string()}),
      400: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
