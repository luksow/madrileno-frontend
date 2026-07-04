import { z } from "zod";
import { oc } from "@orpc/contract";

export const v1AuctionsAuctionIdImagesContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/v1/auctions/{auctionId}/images',
      summary: 'Public: returns auction images sorted by position',
      description: 'List images attached to an auction in display order',
      tags: ['Auction images'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({auctionId: z.string().uuid()})
    }))
    .output(z.array(z.object({
        "auctionId": z.string().uuid(),
        "contentType": z.string(),
        "fileName": z.string(),
        "height": z.number().int().nullish(),
        "id": z.string().uuid(),
        "position": z.number().int(),
        "sizeBytes": z.number().int(),
        "uploadedAt": z.string().datetime({ offset: true }),
        "url": z.string(),
        "variants": z.array(z.object({
        "format": z.string(),
        "height": z.number().int(),
        "spec": z.string(),
        "url": z.string(),
        "width": z.number().int()})),
        "width": z.number().int().nullish()}))),
  post: oc
    .route({
      method: 'POST',
      path: '/v1/auctions/{auctionId}/images',
      summary: 'Seller-only: uploads bytes to object storage and persists the row',
      description: 'Attach an image to an auction (multipart upload)',
      tags: ['Auction images'],
      successStatus: 201,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({auctionId: z.string().uuid()}),
      body: z.object({file: z.instanceof(File)})
    }))
    .output(z.object({
        "auctionId": z.string().uuid(),
        "contentType": z.string(),
        "fileName": z.string(),
        "height": z.number().int().nullish(),
        "id": z.string().uuid(),
        "position": z.number().int(),
        "sizeBytes": z.number().int(),
        "uploadedAt": z.string().datetime({ offset: true }),
        "url": z.string(),
        "variants": z.array(z.object({
        "format": z.string(),
        "height": z.number().int(),
        "spec": z.string(),
        "url": z.string(),
        "width": z.number().int()})),
        "width": z.number().int().nullish()}))
    .errors({
      'result:auction-not-found': {
        status: 404,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      },
      'result:not-owner': {
        status: 403,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
