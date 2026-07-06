import { z } from "zod";

export const createAuctionRequestSchema = z.object({
        "appellation": z.string(),
        "bottleCount": z.number().int(),
        "bottleSize": z.enum(["DoubleMagnum","Half","Jeroboam","Magnum","Other","Standard"]),
        "color": z.enum(["Dessert","Fortified","Orange","Red","Rose","Sparkling","White"]),
        "currency": z.string(),
        "description": z.string().nullish(),
        "endsAt": z.iso.datetime({ offset: true }),
        "producerName": z.string(),
        "region": z.string(),
        "startingPrice": z.number(),
        "startsAt": z.iso.datetime({ offset: true }),
        "vintage": z.number().int().nullish(),
        "wineName": z.string()});
export type CreateAuctionRequest = z.infer<typeof createAuctionRequestSchema>;

export const placeBidRequestSchema = z.object({
        "amount": z.number()});
export type PlaceBidRequest = z.infer<typeof placeBidRequestSchema>;

export const reorderImagesRequestSchema = z.object({
        "orderedIds": z.array(z.uuid())});
export type ReorderImagesRequest = z.infer<typeof reorderImagesRequestSchema>;

export const variantDtoSchema = z.object({
        "format": z.string(),
        "height": z.number().int(),
        "spec": z.string(),
        "url": z.string(),
        "width": z.number().int()});
export type VariantDto = z.infer<typeof variantDtoSchema>;

export const vivinoRatingDtoSchema = z.object({
        "rating": z.number(),
        "ratingsCount": z.number().int()});
export type VivinoRatingDto = z.infer<typeof vivinoRatingDtoSchema>;

export const auctionDtoSchema = z.object({
        "appellation": z.string(),
        "bottleCount": z.number().int(),
        "bottleSize": z.enum(["DoubleMagnum","Half","Jeroboam","Magnum","Other","Standard"]),
        "color": z.enum(["Dessert","Fortified","Orange","Red","Rose","Sparkling","White"]),
        "currency": z.string(),
        "currentPrice": z.number(),
        "description": z.string().nullish(),
        "endsAt": z.iso.datetime({ offset: true }),
        "id": z.uuid(),
        "producerName": z.string(),
        "rating": vivinoRatingDtoSchema.nullish(),
        "region": z.string(),
        "sellerId": z.uuid(),
        "startingPrice": z.number(),
        "startsAt": z.iso.datetime({ offset: true }),
        "status": z.enum(["Cancelled","Closed","Open"]),
        "vintage": z.number().int().nullish(),
        "wineName": z.string()});
export type AuctionDto = z.infer<typeof auctionDtoSchema>;

export const auctionImageDtoSchema = z.object({
        "auctionId": z.uuid(),
        "contentType": z.string(),
        "fileName": z.string(),
        "height": z.number().int().nullish(),
        "id": z.uuid(),
        "position": z.number().int(),
        "sizeBytes": z.number().int(),
        "uploadedAt": z.iso.datetime({ offset: true }),
        "url": z.string(),
        "variants": z.array(variantDtoSchema),
        "width": z.number().int().nullish()});
export type AuctionImageDto = z.infer<typeof auctionImageDtoSchema>;

export const pageSchema = z.object({
        "items": z.array(auctionDtoSchema),
        "limit": z.number().int(),
        "offset": z.number().int(),
        "total": z.number().int()});
export type Page = z.infer<typeof pageSchema>;
