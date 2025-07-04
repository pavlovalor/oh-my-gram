import { type PipeTransform, Injectable, type ArgumentMetadata, BadRequestException } from '@nestjs/common'
import type { ZodSchema } from 'zod'

@Injectable()
export class ZodTransformPipe implements PipeTransform {
  constructor(private schema: ZodSchema<unknown>) {}

  async transform(value: unknown, _metadata: ArgumentMetadata) {
    return await this.schema.parseAsync(value)
      .catch(exception => {
        throw new BadRequestException(exception)
      })
  }
}
