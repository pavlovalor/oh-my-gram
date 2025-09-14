import { createZodDto, zodToOpenAPI } from 'nestjs-zod'
import {
  SignInWithCredentialsRequestSchema,
  SignUpWithCredentialsRequestSchema,
  RefreshSessionRequestSchema,
  TokenPairResponseSchema,
} from '@omg/public-contracts-registry'


type OpenApiSchema = ReturnType<typeof zodToOpenAPI>

export namespace AuthJsonSchema {
  export const SignUpWithCredentialsRequest: OpenApiSchema = zodToOpenAPI(SignUpWithCredentialsRequestSchema)
  export const SignInWithCredentialsRequest: OpenApiSchema = zodToOpenAPI(SignInWithCredentialsRequestSchema)
  export const RefreshSessionRequest: OpenApiSchema = zodToOpenAPI(RefreshSessionRequestSchema)
  export const TokenPairResponse: OpenApiSchema = zodToOpenAPI(TokenPairResponseSchema)
}


export namespace AuthDto {
  export class SignUpWithCredentialsRequest extends createZodDto(SignUpWithCredentialsRequestSchema) {}
  export class SignInWithCredentialsRequest extends createZodDto(SignInWithCredentialsRequestSchema) {}
  export class RefreshSessionRequest extends createZodDto(RefreshSessionRequestSchema) {}
  export class TokenPairResponse extends createZodDto(TokenPairResponseSchema) {}
}
