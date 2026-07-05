import { z } from "zod";
import { oc } from "@orpc/contract";
import { auctionDtoSchema, errorSchema1bb3, errorSchema4c2a, errorSchema7023 } from "./schemas";

export const v1AuctionsAuctionIdContract = {
  delete: oc
    .route({
      method: 'DELETE',
      path: '/v1/auctions/{auctionId}',
      summary: 'Seller-only: cancels an open auction',
      description: 'Cancel an auction',
      tags: ['Auctions'],
      successStatus: 204,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({auctionId: z.uuid()})
    }))
    .output(z.void())
    .errors({
      'result:auction-not-found': {
        status: 404,
        data: errorSchema7023
      },
      'result:auction-not-open': {
        status: 409,
        data: errorSchema1bb3
      },
      'result:not-owner': {
        status: 403,
        data: errorSchema4c2a
      }
    }),
  get: oc
    .route({
      method: 'GET',
      path: '/v1/auctions/{auctionId}',
      summary: 'Unauthenticated: returns an auction with its current price',
      description: 'Get an auction by id',
      tags: ['Auctions'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({auctionId: z.uuid()})
    }))
    .output(auctionDtoSchema)
    .errors({
      'result:auction-not-found': {
        status: 404,
        data: errorSchema7023
      }
    })
};
