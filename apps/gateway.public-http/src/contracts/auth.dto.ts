import { createZodDto } from 'nestjs-zod'
import {
  RefreshSessionRequestSchema,
  SignInWithCredentialsRequestSchema,
  SignUpWithCredentialsRequestSchema,
  TokenPairResponseSchema
} from './auth.schemas'


export class SignUpWithCredentialsRequestDto extends createZodDto(SignUpWithCredentialsRequestSchema) {}
export class SignInWithCredentialsRequestDto extends createZodDto(SignInWithCredentialsRequestSchema) {}
export class RefreshSessionRequestDto extends createZodDto(RefreshSessionRequestSchema) {}
export class TokenPairResponseDto extends createZodDto(TokenPairResponseSchema) {}
