// Global
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger'
import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

// Local
import { NatsClientInjectionToken } from '~/app/app.constants'
import { AuthDto, AuthJsonSchema } from '~/contracts/auth.contracts'
import {
  SignInWithCredentialsCommand,
  SignUpWithCredentialsCommand,
  RefreshSessionCommand,
} from '@omg/message-registry'


@Controller('auth')
export class AuthController {
  constructor(@Inject(NatsClientInjectionToken) private readonly natsClient: ClientProxy) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up providing credentials' })
  @ApiResponse({ status: 200, description: '`Ok` Session created', schema: AuthJsonSchema.TokenPairResponse })
  @ApiResponse({ status: 400, description: '`BadRequest` Invalid payload' })
  @ApiResponse({ status: 401, description: '`Unauthorized` Identity does not exist' })
  @ApiResponse({ status: 423, description: '`Locked` Account restriction' })
  @ApiResponse({ status: 500, description: '`InternalServerError` We screwed up' })
  @ApiBody({ schema: AuthJsonSchema.SignUpWithCredentialsRequest })
  public async signUp(
    @Body() dto: AuthDto.SignUpWithCredentialsRequest,
  ): Promise<AuthDto.TokenPairResponse> {
    return new SignUpWithCredentialsCommand({ ...dto, login: dto.email ?? dto.phoneNumber! })
      .executeVia(this.natsClient)
  }


  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in with credentials' })
  @ApiResponse({ status: 200, description: '`Ok` Session created', schema: AuthJsonSchema.TokenPairResponse })
  @ApiResponse({ status: 400, description: '`BadRequest` Invalid payload' })
  @ApiResponse({ status: 401, description: '`Unauthorized` Identity does not exist' })
  @ApiResponse({ status: 423, description: '`Locked` Account restriction' })
  @ApiResponse({ status: 500, description: '`InternalServerError` We screwed up' })
  @ApiBody({ schema: AuthJsonSchema.SignInWithCredentialsRequest })
  public signIn(
    @Body() dto: AuthDto.SignInWithCredentialsRequest,
  ): Promise<AuthDto.TokenPairResponse> {
    return new SignInWithCredentialsCommand({ ...dto, login: dto.email ?? dto.phoneNumber! })
      .executeVia(this.natsClient)
  }


  @Post('refresh')
  @ApiOperation({ summary: 'Refresh session obtaining new token pair' })
  @ApiResponse({ status: 200, description: '`Ok` Session refreshed', schema: AuthJsonSchema.TokenPairResponse })
  @ApiResponse({ status: 400, description: '`BadRequest` Invalid payload' })
  @ApiResponse({ status: 401, description: '`Unauthorized` Refresh token expired' })
  @ApiResponse({ status: 423, description: '`Locked` Account restriction' })
  @ApiResponse({ status: 500, description: '`InternalServerError` We screwed up' })
  @ApiBody({ schema: AuthJsonSchema.RefreshSessionRequest, required: true })
  @ApiBearerAuth()
  public refreshSession(
    @Body() dto: AuthDto.RefreshSessionRequest,
  ): Promise<AuthDto.TokenPairResponse> {
    return new RefreshSessionCommand(dto)
      .executeVia(this.natsClient)
  }
}
