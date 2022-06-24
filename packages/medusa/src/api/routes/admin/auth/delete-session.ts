import { AuthService } from "../../../../services"
import { Request, Response } from "express"

/**
 * @oas [delete] /auth
 * operationId: "DeleteAuth"
 * summary: "Delete Session"
 * x-authenticated: true
 * description: "Deletes the current session for the logged in user."
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
    "admin"
  )
  await authStrategy.unAuthenticate(req, res)
}
