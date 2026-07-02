import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuctionsAuctionIdImagesImageIdContentContract = initContract().router({
  get: {
    summary: 'Public: image content',
    description: 'Stream or redirect to image bytes. The disk / in-memory backend streams; S3 returns 303 SeeOther with a presigned Location.',
    method: 'GET',
    path: '/v1/auctions/:auctionId/images/:imageId/content',
    pathParams: z.object({auctionId: z.string().uuid(), imageId: z.string().uuid()}),
    responses: {
      200: z.string(),
      404: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
