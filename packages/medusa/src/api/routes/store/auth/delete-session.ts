import { AuthService } from "../../../../services"
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
  const authService = req.scope.resolve("authService") as AuthService
  const authStrategy = await authService.retrieveAuthenticationStrategyToUse(
    req,
    "store"
  )
  await authStrategy.unAuthenticate(req, res)
}
