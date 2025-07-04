import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { EnvironmentService } from '@omg/environment-module'
import { EnvironmentSchema } from './app/app.env-schema'
import * as color from 'cli-color'
import helmet from 'helmet'


const logger = new Logger('BootstrapScript')
type EnvironmentServiceType = EnvironmentService<typeof EnvironmentSchema>;


~async function bootstrap() {
  logger.log('Preparing application for launch')

  const { ApplicationModule } = await import('./app/app.module')
  const { attachDocumentation } = await import('./docs')

  const app = await NestFactory.create(ApplicationModule)
  const environmentService = app.get<EnvironmentServiceType>(EnvironmentService)
  const natsUrl = environmentService.get('NATS_URL')
  const baseUrl = environmentService.get('BASE_URL')
  const appPort = environmentService.get('PORT')
  const docsDir = environmentService.get('DOCS_DIR')
  const prefix = environmentService.get('ROUTES_PREFIX')

  app.enableCors()
  app.enableShutdownHooks()
  app.use(helmet({
    strictTransportSecurity: true,
    hidePoweredBy: true,
    xFrameOptions: true,
  }))

  if (prefix) app.setGlobalPrefix(prefix)

  const docOptions = await attachDocumentation(docsDir, app)
  const jsonSchemaUrl = `${baseUrl}/${docOptions.jsonDocumentUrl}`
  const yamlSchemaUrl = `${baseUrl}/${docOptions.yamlDocumentUrl}`
  const docPortalUrl = `${baseUrl}/${docsDir}`

  await app.listen(appPort, '0.0.0.0')

  logger.log(`Listens to NATS on ${color.blue(natsUrl)}`)
  logger.log(`Available on port ${color.yellow(appPort)}`)
  logger.log(`Open API docs on: ${color.blue(docPortalUrl)}`)
  logger.verbose(`Available declaration files:`)
  logger.verbose(`- [json] ${color.blue(jsonSchemaUrl)}`)
  logger.verbose(`- [yaml] ${color.blue(yamlSchemaUrl)}`)
}()
