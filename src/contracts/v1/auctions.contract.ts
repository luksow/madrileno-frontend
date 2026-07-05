import { z } from "zod";
import { oc } from "@orpc/contract";
import { auctionDtoSchema, auctionImageDtoSchema, createAuctionRequestSchema, errorSchema1b1f, errorSchema1bb3, errorSchema4c2a, errorSchema7023, pageSchema, placeBidRequestSchema, reorderImagesRequestSchema } from "../schemas";

export const v1Auctions = {
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
    }),
  byAuctionId: {
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
      }),
    bids: {
      get: oc
        .route({
          method: 'GET',
          path: '/v1/auctions/{auctionId}/bids',
          summary: 'Unauthenticated: bids newest-first; bidder identity is a per-auction pseudonym (bidderRef)',
          description: 'List the bid history for an auction, newest-first, cursor-paginated by bid id.',
          tags: ['Auctions'],
          successStatus: 200,
          inputStructure: 'detailed'
        })
        .input(z.object({
          params: z.object({auctionId: z.uuid()}),
          query: z.object({limit: z.number().int().nullish(), "after-id": z.uuid().nullish()}).optional()
        }))
        .output(z.object({
            "hasMore": z.boolean(),
            "items": z.array(z.object({
            "amount": z.number(),
            "bidderRef": z.string(),
            "createdAt": z.iso.datetime({ offset: true }),
            "currency": z.string(),
            "id": z.uuid()}))}))
        .errors({
          'result:auction-not-found': {
            status: 404,
            data: errorSchema7023
          }
        }),
      post: oc
        .route({
          method: 'POST',
          path: '/v1/auctions/{auctionId}/bids',
          summary: 'Authenticated: places a bid above the current highest',
          description: 'Place a bid on an auction',
          tags: ['Auctions'],
          successStatus: 201,
          inputStructure: 'detailed'
        })
        .input(z.object({
          params: z.object({auctionId: z.uuid()}),
          body: placeBidRequestSchema
        }))
        .output(z.object({
            "amount": z.number(),
            "auctionId": z.uuid(),
            "bidderId": z.uuid(),
            "createdAt": z.iso.datetime({ offset: true }),
            "id": z.uuid()}))
        .errors({
          'result:already-highest-bidder': {
            status: 409,
            data: z.object({
            "detail": z.string().describe("Human-readable explanation").nullish(),
            "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
            "status": z.number().int().describe("HTTP status code"),
            "title": z.string().describe("Short human-readable summary"),
            "type": z.enum(["result:already-highest-bidder"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
          },
          'result:auction-not-found': {
            status: 404,
            data: errorSchema7023
          },
          'result:auction-not-open': {
            status: 409,
            data: errorSchema1bb3
          },
          'result:auction-not-started': {
            status: 409,
            data: z.object({
            "detail": z.string().describe("Human-readable explanation").nullish(),
            "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
            "status": z.number().int().describe("HTTP status code"),
            "title": z.string().describe("Short human-readable summary"),
            "type": z.enum(["result:auction-not-started"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
          },
          'result:bid-too-low': {
            status: 409,
            data: z.object({
            "detail": z.string().describe("Human-readable explanation").nullish(),
            "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
            "status": z.number().int().describe("HTTP status code"),
            "title": z.string().describe("Short human-readable summary"),
            "type": z.enum(["result:bid-too-low"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
          },
          'result:cannot-bid-on-own-auction': {
            status: 403,
            data: z.object({
            "detail": z.string().describe("Human-readable explanation").nullish(),
            "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
            "status": z.number().int().describe("HTTP status code"),
            "title": z.string().describe("Short human-readable summary"),
            "type": z.enum(["result:cannot-bid-on-own-auction"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
          }
        })
    },
    images: {
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
        }),
      byImageId: {
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
            params: z.object({auctionId: z.uuid(), imageId: z.uuid()})
          }))
          .output(z.void())
          .errors({
            'result:image-not-found': {
              status: 404,
              data: errorSchema1b1f
            },
            'result:not-owner': {
              status: 403,
              data: errorSchema4c2a
            }
          }),
        content: {
          get: oc
            .route({
              method: 'GET',
              path: '/v1/auctions/{auctionId}/images/{imageId}/content',
              summary: 'Public: image content',
              description: 'Stream or redirect to image bytes. The disk / in-memory backend streams; S3 returns 303 SeeOther with a presigned Location.',
              tags: ['Auction images'],
              successStatus: 200,
              inputStructure: 'detailed'
            })
            .input(z.object({
              params: z.object({auctionId: z.uuid(), imageId: z.uuid()})
            }))
            .output(z.string())
            .errors({
              'result:image-not-found': {
                status: 404,
                data: errorSchema1b1f
              }
            })
        }
      },
      order: {
        patch: oc
          .route({
            method: 'PATCH',
            path: '/v1/auctions/{auctionId}/images/order',
            summary: 'Seller-only: bulk position update with mismatched-id guard',
            description: 'Reorder images on an auction (must include every active image id)',
            tags: ['Auction images'],
            successStatus: 204,
            inputStructure: 'detailed'
          })
          .input(z.object({
            params: z.object({auctionId: z.uuid()}),
            body: reorderImagesRequestSchema
          }))
          .output(z.void())
          .errors({
            'result:mismatched-ids': {
              status: 400,
              data: z.object({
              "detail": z.string().describe("Human-readable explanation").nullish(),
              "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
              "status": z.number().int().describe("HTTP status code"),
              "title": z.string().describe("Short human-readable summary"),
              "type": z.enum(["result:mismatched-ids"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
            }
          })
      }
    },
    stream: {
      get: oc
        .route({
          method: 'GET',
          path: '/v1/auctions/{auctionId}/stream',
          summary: 'Live event stream for one auction (WebSocket)',
          description: 'Live event stream for a single auction over WebSocket — same wire format as `/v1/auctions/stream`,\nbut only `AuctionCreated`/`BidPlaced`/`AuctionCancelled`/`AuctionClosed` events for this `auctionId`.\n\nOpenAPI 3.x does not model WebSockets; this entry exists for discoverability only. A plain GET\n(no `Upgrade` header) returns 426 Upgrade Required with the body `Upgrade required for WebSocket communication.`',
          tags: ['Auctions'],
          inputStructure: 'detailed'
        })
        .input(z.object({
          params: z.object({auctionId: z.uuid()})
        }))
    }
  },
  stream: {
    get: oc
      .route({
        method: 'GET',
        path: '/v1/auctions/stream',
        summary: 'Live auction event stream (WebSocket)',
        description: 'Live auction event stream over WebSocket — the firehose (every auction).\n\nConnect with a WebSocket client to receive a JSON frame per event. Wire format:\n`{"kind": "...", "data": {...}}` where `kind` is one of `AuctionCreated`, `BidPlaced`,\n`AuctionCancelled`, `AuctionClosed` and `data` is the per-variant flat DTO. See\n`docs/adding-a-module.md` for the wire shapes.\n\nFor a single auction\'s events, connect to `/v1/auctions/{auctionId}/stream` instead.\n\nOpenAPI 3.x does not model WebSockets; this entry exists for discoverability only.\nA WebSocket upgrade request returns 101 Switching Protocols and starts streaming.\nA plain GET (no `Upgrade` header) returns 426 Upgrade Required with the body\n`Upgrade required for WebSocket communication.` — documented below.',
        tags: ['Auctions'],
        inputStructure: 'detailed'
      })
  }
};
