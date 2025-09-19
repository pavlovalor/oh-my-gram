import { RedisService } from '@liaoliaots/nestjs-redis'
import { JwtAlgorithmDigestSet } from '../authz.constants'
import { AccessTokenHeaders } from '@omg/public-contracts-registry'
import { randomArrayItem } from '@omg/utils-module'
import { Injectable } from '@nestjs/common'
import { randomUUID, randomBytes } from 'node:crypto'
import * as dayjs from 'dayjs'
import Redis from 'ioredis'


/** Shape of a stored JWK entry */
export interface JwkData {
  id: string,
  value: string,
  meta: {
    createdAt: string,
    type: AccessTokenHeaders['alg'],
  },
}

const JwkLifetime = dayjs.duration(1, 'day')
const JwkFreshnessDuration = dayjs.duration(1, 'hour')

@Injectable()
export class JwkRedisRepository {
  private readonly redis: Redis
  private readonly prefix = 'jwk:'
  private readonly prefixLatest = 'jwk:latest'

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow()
  }


  /** Generates a fresh JWK, stores it, and returns the data */
  private async introduce() {
    const [, type] = randomArrayItem(JwtAlgorithmDigestSet)
    const createdAt = dayjs().toISOString()
    const bytes = randomBytes(32)
    const id = randomUUID()

    const entry: JwkData = {
      id,
      meta: { createdAt, type },
      value: bytes.toString('base64'),
    }

    // store in Redis and push to head of list
    await this.redis.set(this.prefix + id, JSON.stringify(entry))
    await this.redis.lpush(this.prefixLatest, id)
    await this.redis.expire(this.prefix + id, JwkLifetime.asSeconds())
    await this.redis.expire(this.prefixLatest, JwkLifetime.asSeconds())

    return entry
  }


  public async getById(jwkId: JwkData['id']): Promise<JwkData | null> {
    const fullySerializedEntry = await this.redis.get(this.prefix + jwkId)
    if (!fullySerializedEntry) return null

    return JSON.parse(fullySerializedEntry) as JwkData
  }


  /** Returns the most recent JWK, generating a new one if none exist or if the latest is stale (>1h) */
  public async getLatest(): Promise<JwkData> {
    const id = await this.redis.lindex(this.prefixLatest, 0)

    if (id) {
      const latest = await this.getById(id)
      if (latest) {
        const isFresh = dayjs(latest.meta.createdAt).add(JwkFreshnessDuration).isAfter()
        if (isFresh) return latest
      }
    }

    // no valid latest → introduce new
    return this.introduce()
  }
}
