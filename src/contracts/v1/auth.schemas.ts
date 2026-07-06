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
