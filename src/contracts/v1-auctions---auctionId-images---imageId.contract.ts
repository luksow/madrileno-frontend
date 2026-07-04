import { z } from "zod";
import { oc } from "@orpc/contract";

export const v1AuctionsAuctionIdImagesImageIdContract = {
  delete: oc
    .route({
      method: 'DELETE',
      path: '/v1/auctions/{auctionId}/images/{imageId}',
      summary: 'Seller-only: detaches an image from the auction',
      description: 'Soft-delete an image and remove it from object storage',
      tags: ['Auction images'],
      successStatus: 204,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({auctionId: z.string().uuid(), imageId: z.string().uuid()})
    }))
    .output(z.void())
    .errors({
      'result:image-not-found': {
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
