import { StrategyResolverService } from "../../../../services"
import { Request, Response } from "express"

/**
 * @oas [delete] /auth
 * operationId: "DeleteAuth"
 * summary: "Log out"
 * description: "Destroys a Customer's authenticated session."
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 */
export default async (req: Request, res: Response) => {
  const strategyResolver = req.scope.resolve(
    "strategyResolverService"
  ) as StrategyResolverService

  const authStrategyType = (req.headers["X-medusa-auth-strategy"] ??
    "core-store-default-auth") as string

  const authStrategy = strategyResolver.resolveAuthByType(authStrategyType)
  await authStrategy.unAuthenticate(req, res)
}
