import { Body, Controller, NotImplementedException, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger'
import { AuthDto, AuthJsonSchema } from '~/contracts/auth.contracts'

@Controller('auth')
export class AuthController {
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up providing credentials' })
  @ApiResponse({ status: 200, description: '`Ok` Session created', schema: AuthJsonSchema.TokenPairResponse })
  @ApiResponse({ status: 400, description: '`BadRequest` Invalid payload' })
  @ApiResponse({ status: 401, description: '`Unauthorized` Identity does not exist' })
  @ApiResponse({ status: 423, description: '`Locked` Account restriction' })
  @ApiResponse({ status: 500, description: '`InternalServerError` We screwed up' })
  @ApiBody({ schema: AuthJsonSchema.SignUpWithCredentialsRequest })
  public signUp(
    @Body() _dto: AuthDto.SignUpWithCredentialsRequest,
  ): Promise<AuthDto.TokenPairResponse> {
    throw new NotImplementedException()
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
    @Body() _dto: AuthDto.SignInWithCredentialsRequest,
  ): Promise<AuthDto.TokenPairResponse> {
    throw new NotImplementedException()
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
  public refreshTokenPair(
    @Body() _dto: AuthDto.RefreshSessionRequest,
  ): Promise<AuthDto.TokenPairResponse> {
    throw new NotImplementedException()
  }
}
