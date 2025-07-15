import { type PipeTransform, Injectable, type ArgumentMetadata, BadRequestException, Provider } from '@nestjs/common'
import { type ZodSchema } from 'zod'
import { APP_PIPE } from '@nestjs/core'


@Injectable()
export class ZodTransformPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (!metadata.metatype) return value
    if ('schema' in metadata.metatype) {
      const schema = metadata.metatype.schema as ZodSchema<unknown>
      return await schema.parseAsync(value)
        .catch(exception => {
          throw new BadRequestException(exception)
        })
    }

    return value
  }

  static asProvider(): Provider {
    return {
      useClass: ZodTransformPipe,
      provide: APP_PIPE,
    }
  }
}
