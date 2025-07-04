import { type PipeTransform, Injectable, type ArgumentMetadata, BadRequestException, Provider } from '@nestjs/common'
import { type ZodSchema } from 'zod'
import { APP_PIPE } from '@nestjs/core'


@Injectable()
export class ZodTransformPipe implements PipeTransform {
  constructor(private schema: ZodSchema<unknown>) {}

  async transform(value: unknown, _metadata: ArgumentMetadata) {
    return await this.schema.parseAsync(value)
      .catch(exception => {
        throw new BadRequestException(exception)
      })
  }

  static asProvider(): Provider {
    return {
      useClass: ZodTransformPipe,
      provide: APP_PIPE,
    }
  }
}
