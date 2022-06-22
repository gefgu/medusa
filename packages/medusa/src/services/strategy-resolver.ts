import { AbstractBatchJobStrategy, TransactionBaseService } from "../interfaces"
import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import AbstractAuthStrategy from "../interfaces/authentication-strategy"

type InjectedDependencies = {
  manager: EntityManager
  [key: string]: unknown
}

export default class StrategyResolver extends TransactionBaseService<
  StrategyResolver,
  InjectedDependencies
> {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  constructor(container: InjectedDependencies) {
    super(container)
    this.manager_ = container.manager
  }

  resolveBatchJobByType<T extends TransactionBaseService<never>>(
    type: string
  ): AbstractBatchJobStrategy<T> {
    let resolved: AbstractBatchJobStrategy<T>
    try {
      resolved = this.container[
        `batchType_${type}`
      ] as AbstractBatchJobStrategy<T>
    } catch (e) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Unable to find a BatchJob strategy with the type ${type}`
      )
    }
    return resolved
  }

  resolveAuthByType<T extends TransactionBaseService<never>>(
    type: string
  ): AbstractAuthStrategy<T> {
    let resolved: AbstractAuthStrategy<T>
    try {
      resolved = this.container[`auth_${type}`] as AbstractAuthStrategy<T>
    } catch (e) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Unable to find an auth strategy with the type ${type}`
      )
    }
    return resolved
  }
}
