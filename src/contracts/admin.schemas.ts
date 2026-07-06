import { z } from "zod";

export const createSegmentRequestSchema = z.object({
        "conditions": z.array(z.object({})),
        "description": z.string(),
        "name": z.string()});

export const depCheckSchema = z.object({
        "error": z.string().nullish(),
        "latencyMs": z.number().int().nullish(),
        "status": z.enum(["Down","Up"])});

export const evaluateFlagRequestSchema = z.object({
        "attributes": z.record(z.string(), z.string()),
        "targetingKey": z.string()});

export const loggerLevelDtoSchema = z.object({
        "configuredLevel": z.string().nullish(),
        "effectiveLevel": z.string(),
        "name": z.string()});

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
