import { z } from "zod";

export const authWithEmailRequestSchema = z.object({
        "email": z.string()});

export const authWithFirebaseRequestSchema = z.object({
        "firebaseJwtToken": z.string()});

export const authWithOidcRequestSchema = z.object({
        "idToken": z.string()});

export const authWithRefreshTokenRequestSchema = z.object({
        "refreshToken": z.uuid()});

export const authenticatedResponseSchema = z.object({
        "jwt": z.string(),
        "refreshToken": z.uuid(),
        "userCreated": z.boolean()});

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

export const createSegmentRequestSchema = z.object({
        "conditions": z.array(z.object({})),
        "description": z.string(),
        "name": z.string()});

export const depCheckSchema = z.object({
        "error": z.string().nullish(),
        "latencyMs": z.number().int().nullish(),
        "status": z.enum(["Down","Up"])});

export const errorSchema = z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["rejection:authentication-failed"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response");

export const errorSchema1b1f = z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:image-not-found"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response");

export const errorSchema1bb3 = z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:auction-not-open"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response");

export const errorSchema330d = z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:logger-not-found"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response");

export const errorSchema4c2a = z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:not-owner"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response");

export const errorSchema7023 = z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:auction-not-found"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response");

export const errorSchemab1f1 = z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:flag-not-found"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response");

export const errorSchemab24e = z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:segment-not-found"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response");

export const errorSchemafbd6 = z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:invalid-token"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response");

export const evaluateFlagRequestSchema = z.object({
        "attributes": z.record(z.string(), z.string()),
        "targetingKey": z.string()});

export const loggerLevelDtoSchema = z.object({
        "configuredLevel": z.string().nullish(),
        "effectiveLevel": z.string(),
        "name": z.string()});

export const placeBidRequestSchema = z.object({
        "amount": z.number()});

export const reorderImagesRequestSchema = z.object({
        "orderedIds": z.array(z.uuid())});

export const ruleDtoSchema = z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.iso.datetime({ offset: true }),
        "description": z.string(),
        "id": z.uuid(),
        "outcome": z.object({}),
        "position": z.number().int()});

export const ruleRequestSchema = z.object({
        "conditions": z.array(z.object({})),
        "description": z.string(),
        "outcome": z.object({}),
        "position": z.number().int()});

export const segmentDtoSchema = z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.iso.datetime({ offset: true }),
        "description": z.string(),
        "id": z.uuid(),
        "name": z.string(),
        "updatedAt": z.iso.datetime({ offset: true })});

export const setLoggerLevelRequestSchema = z.object({
        "level": z.string().nullish()});

export const toggleFlagRequestSchema = z.object({
        "enabled": z.boolean()});

export const updateSegmentRequestSchema = z.object({
        "conditions": z.array(z.object({})),
        "description": z.string()});

export const variantDtoSchema = z.object({
        "format": z.string(),
        "height": z.number().int(),
        "spec": z.string(),
        "url": z.string(),
        "width": z.number().int()});

export const vivinoRatingDtoSchema = z.object({
        "rating": z.number(),
        "ratingsCount": z.number().int()});

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

export const createFlagRequestSchema = z.object({
        "clientExposed": z.boolean(),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
        "key": z.string(),
        "rules": z.array(ruleRequestSchema)});

export const featureFlagDtoSchema = z.object({
        "clientExposed": z.boolean(),
        "createdAt": z.iso.datetime({ offset: true }),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
        "id": z.uuid(),
        "key": z.string(),
        "rules": z.array(ruleDtoSchema),
        "updatedAt": z.iso.datetime({ offset: true })});

export const featureFlagDtoSchema4496 = z.object({
        "clientExposed": z.boolean(),
        "createdAt": z.iso.datetime({ offset: true }),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
        "id": z.uuid(),
        "key": z.string(),
        "rules": z.array(ruleDtoSchema),
        "updatedAt": z.iso.datetime({ offset: true })});

export const updateFlagRequestSchema = z.object({
        "clientExposed": z.boolean(),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
        "rules": z.array(ruleRequestSchema)});

export const pageSchema = z.object({
        "items": z.array(auctionDtoSchema),
        "limit": z.number().int(),
        "offset": z.number().int(),
        "total": z.number().int()});
