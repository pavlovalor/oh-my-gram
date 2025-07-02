import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { EnvironmentService } from '@omg/environment-module'
import { EnvironmentSchema } from './app/app.env-schema'
import * as color from 'cli-color'

const logger = new Logger('BootstrapScript')
type EnvironmentServiceType = EnvironmentService<typeof EnvironmentSchema>;

~ async function _bootstrap() {
  logger.log('Preparing application for launch')

  const { ApplicationModule } = await import('./app/app.module')
  const app = await NestFactory.create(ApplicationModule)
  const environmentService = app.get<EnvironmentServiceType>(EnvironmentService)
  const natsUrl = environmentService.get('NATS_URL')
  const appPort = environmentService.get('PORT')

  app.enableCors()
  app.enableShutdownHooks()

  await app.listen(appPort, '0.0.0.0')
  logger.log(`Listens to NATS on ${color.blue(natsUrl)}`)
  logger.log(`Available on port ${color.yellow(appPort)}`)
}()
