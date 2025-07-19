import { Injectable } from '@nestjs/common'
import { EnvironmentService } from '@omg/environment-module'
import { EnvironmentSchema } from './app.env-schema'
import * as crypto from 'node:crypto'


@Injectable()
export class ApplicationService {
  private static salt = 'slH54Sf5xMdxa6OpkmofOzVdN001MODl'

  constructor(
    private readonly environmentService: EnvironmentService<typeof EnvironmentSchema>
  ) {}

  /**
   * Generates a secure, predictable hash for a given password string.
   *
   * @param password - The password string to be hashed.
   * @returns The SHA-256 hash of the combined salt, password, and pepper.
   *  This hash is represented as a hexadecimal string.
   */
  public generatePasswordHash(password: string): string {
    const pepper = this.environmentService.get('PEPPER')

    return crypto
      .createHash('sha256')
      .update(ApplicationService.salt + password + pepper)
      .digest('hex')
  }


  public generateRefreshToken(length: number): string {
    return crypto
      .randomBytes(length * 2)
      .toString('hex')
      .slice(0, length)
  }
}
