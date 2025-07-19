import { createZodDto, zodToOpenAPI } from 'nestjs-zod'
import { object, string, number, union } from 'zod'

type OpenApiSchema = ReturnType<typeof zodToOpenAPI>

export namespace AuthZodSchema {
  export const RefreshToken = object({
    value: string().length(64),
    ttl: number().int().positive(),
  })

  export const AccessToken = object({
    value: string().jwt(),
    ttl: number().int().positive(),
  })

  export const Credentials = object({
    password: string().min(8).max(64),
    login: union([
      string().regex(/^\+\d{7,15}$/, 'use E.164 format like +380771234567'),
      string().email(),
    ]).describe('Email of phone number'),
  })

  export const TokenPairResponse = object({
    refreshToken: RefreshToken,
    accessToken: AccessToken,
  })

  export const RefreshSessionRequest = object({
    refreshToken: RefreshToken.shape.value,
  })

  export const SignUpWithCredentialsRequest = Credentials
  export const SignInWithCredentialsRequest = Credentials
}


export namespace AuthJsonSchema {
  export const SignUpWithCredentialsRequest: OpenApiSchema = zodToOpenAPI(AuthZodSchema.SignUpWithCredentialsRequest)
  export const SignInWithCredentialsRequest: OpenApiSchema = zodToOpenAPI(AuthZodSchema.SignUpWithCredentialsRequest)
  export const RefreshSessionRequest: OpenApiSchema = zodToOpenAPI(AuthZodSchema.RefreshSessionRequest)
  export const TokenPairResponse: OpenApiSchema = zodToOpenAPI(AuthZodSchema.TokenPairResponse)
}


export namespace AuthDto {
  export class SignUpWithCredentialsRequest extends createZodDto(AuthZodSchema.SignUpWithCredentialsRequest) {}
  export class SignInWithCredentialsRequest extends createZodDto(AuthZodSchema.SignInWithCredentialsRequest) {}
  export class RefreshSessionRequest extends createZodDto(AuthZodSchema.RefreshSessionRequest) {}
  export class TokenPairResponse extends createZodDto(AuthZodSchema.TokenPairResponse) {}
}
