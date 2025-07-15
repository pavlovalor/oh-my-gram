// Global
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import * as color from 'cli-color'

// Local
import { EnvironmentService } from '@omg/environment-module'
import { EnvironmentSchema } from './app/app.env-schema'
import { Queue } from '@omg/message-registry'


const logger = new Logger('BootstrapScript')
type EnvironmentServiceType = EnvironmentService<typeof EnvironmentSchema>;


~ async function bootstrap() {
  logger.log('Preparing application for launch')

  const { ApplicationModule } = await import('./app/app.module')
  const app = await NestFactory.create(ApplicationModule)
  const environmentService = app.get<EnvironmentServiceType>(EnvironmentService)
  const natsUrl = environmentService.get('NATS_URL')
  const appPort = environmentService.get('PORT')

  app.enableCors()
  app.enableShutdownHooks()
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [natsUrl],
      queue: Queue.IdentityService,
    },
  })

  await app.startAllMicroservices()
  await app.listen(appPort, '0.0.0.0')

  logger.log(`Listens to NATS on ${color.blue(natsUrl)}`)
  logger.log(`Queue ${color.yellow(Queue.IdentityService)}`)
  logger.log(`Available on port ${color.yellow(appPort)}`)
}()


