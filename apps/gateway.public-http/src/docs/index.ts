import customCss from './styles.css'
import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder, type SwaggerCustomOptions } from '@nestjs/swagger'
// import { Declaration } from '~/infrastructure/root'


export async function attachDocumentation(localPath: string, app: INestApplication) {
  const title = 'OMG API Schema'
  const description = [
    'TODO'
  ].join(' ')

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion('0.0.1')
    .addSecurity('BearerAuth', {
      type: 'http',
      description: [
        'Authorization method used by users. Token lifetime is configured via the dashboard',
        'Required header format: `Bearer <JWT>`',
      ].join('<br />'),
      bearerFormat: 'JWT',
      scheme: 'bearer',
    })


  // for (const { name, description, externalDoc } of Declaration.aggregatedTags)
  //   config.addTag(name, description, externalDoc)

  const document = SwaggerModule.createDocument(app, config.build(), {
    operationIdFactory(_controllerKey: string, methodKey: string) {
      return `${methodKey}`
    },
  })

  const setupOptions: SwaggerCustomOptions = {
    jsonDocumentUrl: `${localPath}/schema.json`,
    yamlDocumentUrl: `${localPath}/schema.yaml`,
    customSiteTitle: title,
    customCss,
  }

  SwaggerModule.setup(localPath, app, document, setupOptions)

  return setupOptions
}
