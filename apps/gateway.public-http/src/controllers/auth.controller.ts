// Global
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { BadRequestException, Body, Controller, Inject, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

// Local
import { NatsClientInjectionToken } from '~/app/app.constants'
import { AuthDto, AuthJsonSchema } from '~/contracts/auth.contracts'
import { filterException } from '@omg/utils-module'
import { AuthzCheck, AuthzData, AuthzPayload } from '@omg/authz-module'
import {
  SignInWithCredentialsCommand,
  SignUpWithCredentialsCommand,
  RefreshSessionCommand,
  EmailTakenException,
  PhoneNumberTakenException,
  CredentialsDoNotMatchException,
  NoSessionFoundException,
} from '@omg/message-registry'


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NatsClientInjectionToken) private readonly natsClient: ClientProxy,
  ) {}

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
    await new SignUpWithCredentialsCommand(dto)
      .executeVia(this.natsClient)
      .catch(filterException([EmailTakenException, PhoneNumberTakenException], exception => {
        throw new BadRequestException(exception.getError())
      }))

    return new SignInWithCredentialsCommand(dto)
      .executeVia(this.natsClient)
      .catch(filterException([CredentialsDoNotMatchException], exception => {
        throw new BadRequestException(exception.getError())
      }))
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
    // TODO: add device fingerprinting
    return new SignInWithCredentialsCommand(dto)
      .executeVia(this.natsClient)
      .catch(filterException([CredentialsDoNotMatchException], exception => {
        throw new BadRequestException(exception.getError())
      }))
  }


  @Post('refresh')
  @AuthzCheck({ allowExpiredToken: true })
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
    @AuthzData() auth: AuthzPayload,
  ): Promise<AuthDto.TokenPairResponse> {
    // TODO: add device fingerprinting
    return new RefreshSessionCommand(dto, { identityId: auth.identityId })
      .executeVia(this.natsClient)
      .catch(filterException([NoSessionFoundException], exception => {
        console.log('FUUUUCK')
        throw new BadRequestException(exception.getError())
      }))
  }
}
