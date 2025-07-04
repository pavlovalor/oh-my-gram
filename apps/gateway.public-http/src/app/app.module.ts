import { Module } from '@nestjs/common'
import { ApplicationController } from './app.controller'
import { ApplicationService } from './app.service'
import { EnvironmentModule } from '@omg/environment-module'
import { EnvironmentSchema } from './app.env-schema'
import { ZodTransformPipe } from '@omg/utils-module'

import { AuthController } from '~/controllers/auth.controller'


@Module({
  imports: [
    EnvironmentModule.forRoot({
      schema: EnvironmentSchema,
      cache: true,
    }),
  ],
  controllers: [
    ApplicationController,
    AuthController,
  ],
  providers: [
    ApplicationService,
    ZodTransformPipe.asProvider(),
  ],
})
export class ApplicationModule {}
