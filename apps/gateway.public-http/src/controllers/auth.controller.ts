import { Body, Controller, NotImplementedException, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger'
import { ZodTransformPipe } from '@omg/utils-module'
import * as AuthSchema from '~/contracts/auth.schemas'
import * as AuthDto from '~/contracts/auth.dto'


@Controller('auth')
export class AuthController {
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up providing credentials' })
  @ApiResponse({ status: 200, description: 'Session created(Ok)', type: AuthDto.TokenPairResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid payload(BadRequest)' })
  @ApiResponse({ status: 401, description: 'Identity does not exist(Unauthorized)' })
  @ApiResponse({ status: 423, description: 'Account restriction(Locked)' })
  @ApiResponse({ status: 500, description: 'We screwed up(InternalServerError)' })
  @ApiBody({ type: AuthDto.SignUpWithCredentialsRequestDto })
  public signUp(
    @Body(new ZodTransformPipe(AuthSchema.SignUpWithCredentialsRequestSchema))
      _dto: AuthDto.SignUpWithCredentialsRequestDto,
  ): Promise<AuthDto.TokenPairResponseDto> {
    throw new NotImplementedException()
  }


  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in with credentials' })
  @ApiResponse({ status: 200, description: 'Session created(Ok)', type: AuthDto.TokenPairResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid payload(BadRequest)' })
  @ApiResponse({ status: 401, description: 'Identity does not exist(Unauthorized)' })
  @ApiResponse({ status: 423, description: 'Account restriction(Locked)' })
  @ApiResponse({ status: 500, description: 'We screwed up(InternalServerError)' })
  @ApiBody({ type: AuthDto.SignInWithCredentialsRequestDto })
  public signIn(
    @Body(new ZodTransformPipe(AuthSchema.SignInWithCredentialsRequestSchema))
      _dto: AuthDto.SignInWithCredentialsRequestDto,
  ): Promise<AuthDto.TokenPairResponseDto> {
    throw new NotImplementedException()
  }


  @Post('refresh')
  @ApiOperation({ summary: 'Refresh session obtaining new token pair' })
  @ApiResponse({ status: 200, description: 'Session refreshed(Ok)', type: AuthDto.TokenPairResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid payload(BadRequest)' })
  @ApiResponse({ status: 401, description: 'Refresh token expired(Unauthorized)' })
  @ApiResponse({ status: 423, description: 'Account restriction(Locked)' })
  @ApiResponse({ status: 500, description: 'We screwed up(InternalServerError)' })
  @ApiBody({ type: AuthDto.RefreshSessionRequestDto })
  @ApiBearerAuth()
  public refreshTokenPair(
    @Body(new ZodTransformPipe(AuthSchema.RefreshSessionRequestSchema))
      _dto: AuthDto.RefreshSessionRequestDto,
  ): Promise<AuthDto.TokenPairResponseDto> {
    throw new NotImplementedException()
  }
}
