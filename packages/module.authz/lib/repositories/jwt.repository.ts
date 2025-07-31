import { RedisService } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class JwtRedisRepository {
  private readonly presenceKeyPrefix = 'jwt:'
  private readonly redis: Redis

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow()
  }


  private save(key, data) {}
}
