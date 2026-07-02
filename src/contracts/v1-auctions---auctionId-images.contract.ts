import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuctionsAuctionIdImagesContract = initContract().router({
  get: {
    summary: 'Public: returns auction images sorted by position',
    description: 'List images attached to an auction in display order',
    method: 'GET',
    path: '/v1/auctions/:auctionId/images',
    pathParams: z.object({auctionId: z.string().uuid()}),
    responses: {
      200: z.array(z.object({
        "auctionId": z.string().uuid(),
        "contentType": z.string(),
        "fileName": z.string(),
        "height": z.number().int().nullish(),
        "id": z.string().uuid(),
        "position": z.number().int(),
        "sizeBytes": z.number().int(),
        "uploadedAt": z.coerce.date(),
        "url": z.string(),
        "variants": z.array(z.object({
        "format": z.string(),
        "height": z.number().int(),
        "spec": z.string(),
        "url": z.string(),
        "width": z.number().int()})),
        "width": z.number().int().nullish()}))
    }
  },
  post: {
    summary: 'Seller-only: uploads bytes to object storage and persists the row',
    description: 'Attach an image to an auction (multipart upload)',
    method: 'POST',
    path: '/v1/auctions/:auctionId/images',
    pathParams: z.object({auctionId: z.string().uuid()}),
    contentType: 'multipart/form-data',
    body: z.object({file: z.instanceof(File)}),
    responses: {
      201: z.object({
        "auctionId": z.string().uuid(),
        "contentType": z.string(),
        "fileName": z.string(),
        "height": z.number().int().nullish(),
        "id": z.string().uuid(),
        "position": z.number().int(),
        "sizeBytes": z.number().int(),
        "uploadedAt": z.coerce.date(),
        "url": z.string(),
        "variants": z.array(z.object({
        "format": z.string(),
        "height": z.number().int(),
        "spec": z.string(),
        "url": z.string(),
        "width": z.number().int()})),
        "width": z.number().int().nullish()}),
      403: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response"),
      404: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
