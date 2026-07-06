import { z } from "zod";

export const createSegmentRequestSchema = z.object({
        "conditions": z.array(z.object({})),
        "description": z.string(),
        "name": z.string()});
export type CreateSegmentRequest = z.infer<typeof createSegmentRequestSchema>;

export const depCheckSchema = z.object({
        "error": z.string().nullish(),
        "latencyMs": z.number().int().nullish(),
        "status": z.enum(["Down","Up"])});
export type DepCheck = z.infer<typeof depCheckSchema>;

export const evaluateFlagRequestSchema = z.object({
        "attributes": z.record(z.string(), z.string()),
        "targetingKey": z.string()});
export type EvaluateFlagRequest = z.infer<typeof evaluateFlagRequestSchema>;

export const loggerLevelDtoSchema = z.object({
        "configuredLevel": z.string().nullish(),
        "effectiveLevel": z.string(),
        "name": z.string()});
export type LoggerLevelDto = z.infer<typeof loggerLevelDtoSchema>;

export const ruleDtoSchema = z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.iso.datetime({ offset: true }),
        "description": z.string(),
        "id": z.uuid(),
        "outcome": z.object({}),
        "position": z.number().int()});
export type RuleDto = z.infer<typeof ruleDtoSchema>;

export const ruleRequestSchema = z.object({
        "conditions": z.array(z.object({})),
        "description": z.string(),
        "outcome": z.object({}),
        "position": z.number().int()});
export type RuleRequest = z.infer<typeof ruleRequestSchema>;

export const segmentDtoSchema = z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.iso.datetime({ offset: true }),
        "description": z.string(),
        "id": z.uuid(),
        "name": z.string(),
        "updatedAt": z.iso.datetime({ offset: true })});
export type SegmentDto = z.infer<typeof segmentDtoSchema>;

export const setLoggerLevelRequestSchema = z.object({
        "level": z.string().nullish()});
export type SetLoggerLevelRequest = z.infer<typeof setLoggerLevelRequestSchema>;

export const toggleFlagRequestSchema = z.object({
        "enabled": z.boolean()});
export type ToggleFlagRequest = z.infer<typeof toggleFlagRequestSchema>;

export const updateSegmentRequestSchema = z.object({
        "conditions": z.array(z.object({})),
        "description": z.string()});
export type UpdateSegmentRequest = z.infer<typeof updateSegmentRequestSchema>;

export const createFlagRequestSchema = z.object({
        "clientExposed": z.boolean(),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
        "key": z.string(),
        "rules": z.array(ruleRequestSchema)});
export type CreateFlagRequest = z.infer<typeof createFlagRequestSchema>;

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
export type FeatureFlagDto = z.infer<typeof featureFlagDtoSchema>;

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
export type FeatureFlagDto4496 = z.infer<typeof featureFlagDtoSchema4496>;

export const updateFlagRequestSchema = z.object({
        "clientExposed": z.boolean(),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
        "rules": z.array(ruleRequestSchema)});
export type UpdateFlagRequest = z.infer<typeof updateFlagRequestSchema>;
