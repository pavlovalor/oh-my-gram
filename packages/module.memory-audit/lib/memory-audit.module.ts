import { Module, type OnModuleInit, type DynamicModule, type OnModuleDestroy, type ValueProvider, type FactoryProvider, Inject } from '@nestjs/common'
import { type MemoryAuditModuleOptions, type MemoryAuditModuleAsyncOptions } from './memory-audit.types'
import { MemoryAuditConfigInjectionToken } from './memory-audit.constants'
import { MemoryAuditService } from './memory-audit.service'


@Module({})
export class MemoryAuditModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(MemoryAuditConfigInjectionToken)
    private readonly config: MemoryAuditModuleOptions,
    private readonly memoryAuditService: MemoryAuditService
  ) {}


  static forRoot(options: MemoryAuditModuleOptions): DynamicModule {
    const MemoryAuditConfigInjection: ValueProvider = {
      provide: MemoryAuditConfigInjectionToken,
      useValue: options,
    }

    return {
      module: MemoryAuditModule,
      providers: [MemoryAuditService, MemoryAuditConfigInjection],
    }
  }


  static async forRootAsync(options: MemoryAuditModuleAsyncOptions): Promise<DynamicModule> {
    const MemoryAuditConfigInjection: FactoryProvider = {
      provide: MemoryAuditConfigInjectionToken,
      useFactory: options.useFactory,
      inject: options.inject || []
    }

    return {
      module: MemoryAuditModule,
      providers: [MemoryAuditService, MemoryAuditConfigInjection],
    }
  }


  public onModuleInit() {
    if (!this.config)
      throw new Error('MemoryAuditConfig is not configured')

    this.memoryAuditService.start()
  }

  public onModuleDestroy() {
    if (!this.config)
      throw new Error('MemoryAuditConfig is not configured')

    this.memoryAuditService.stop()
  }
}
