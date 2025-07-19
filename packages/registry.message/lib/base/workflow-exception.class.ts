import { RpcException } from '@nestjs/microservices'


export interface WorkflowExceptionPredicates {
  message: string,
  reason?: string,
  code: number,
}

interface WorkflowExceptionInstanceShape extends WorkflowExceptionPredicates {
  meta: object
}

export abstract class WorkflowException extends RpcException {
  public getError() {
    return super.getError() as WorkflowExceptionInstanceShape
  }

  constructor(meta: object = {}) {
    const ctor = new.target as typeof WorkflowException & {
      predicates: WorkflowExceptionPredicates
    }
    // merge default shape with any overrides in meta
    super({ ...ctor.predicates, meta })
  }
}
