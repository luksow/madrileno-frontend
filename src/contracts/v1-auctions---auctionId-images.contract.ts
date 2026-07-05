import { z } from "zod";
import { oc } from "@orpc/contract";
import { auctionImageDtoSchema, errorSchema4c2a, errorSchema7023 } from "./schemas";

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
      params: z.object({auctionId: z.uuid()})
    }))
    .output(z.array(auctionImageDtoSchema)),
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
      params: z.object({auctionId: z.uuid()}),
      body: z.object({file: z.file()})
    }))
    .output(auctionImageDtoSchema)
    .errors({
      'result:auction-not-found': {
        status: 404,
        data: errorSchema7023
      },
      'result:not-owner': {
        status: 403,
        data: errorSchema4c2a
      }
    })
};
