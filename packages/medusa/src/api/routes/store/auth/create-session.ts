import { StrategyResolverService } from "../../../../services"
import { Request, Response } from "express"

/**
 * @oas [post] /auth
 * operationId: "PostAuth"
 * summary: "Authenticate Customer"
 * description: "Logs a Customer in and authorizes them to view their details. Successful authentication will set a session cookie in the Customer's browser."
 * parameters:
 *   - (body) email=* {string} The Customer's email.
 *   - (body) password=* {string} The Customer's password.
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            customer:
 *              $ref: "#/components/schemas/customer"
 */
export default async (req: Request, res: Response) => {
  const strategyResolver = req.scope.resolve(
    "strategyResolverService"
  ) as StrategyResolverService

  const authStrategyType = (req.headers["X-medusa-auth-strategy"] ??
    "core-store-default-auth") as string

  const authStrategy = strategyResolver.resolveAuthByType(authStrategyType)
  await authStrategy.authenticate(req, res)
}
