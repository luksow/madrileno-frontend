import { z } from "zod";
import { oc } from "@orpc/contract";

export const v1AuctionsAuctionIdImagesImageIdContentContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/v1/auctions/{auctionId}/images/{imageId}/content',
      summary: 'Public: image content',
      description: 'Stream or redirect to image bytes. The disk / in-memory backend streams; S3 returns 303 SeeOther with a presigned Location.',
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({auctionId: z.string().uuid(), imageId: z.string().uuid()})
    }))
    .output(z.string())
};

export const v1AuctionsAuctionIdImagesImageIdContentErrors = {
  get: {
    404: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
  }
};
