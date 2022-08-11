import { IsEmail, IsOptional, IsString } from "class-validator"
import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "."

import { Customer } from "../../../.."
import CustomerService from "../../../../services/customer"
import jwt from "jsonwebtoken"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"
import { AuthService } from "../../../../services"
import {
  defaultStoreCustomersFields,
  defaultStoreCustomersRelations,
} from "./index"

/**
 * @oas [post] /customers
 * operationId: PostCustomers
 * summary: Create a Customer
 * description: "Creates a Customer account."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - first_name
 *           - last_name
 *           - email
 *           - password
 *         properties:
 *           first_name:
 *             description: "The Customer's first name."
 *             type: string
 *           last_name:
 *             description: "The Customer's last name."
 *             type: string
 *           email:
 *             description: "The email of the customer."
 *             type: string
 *             format: email
 *           password:
 *             description: "The Customer's password."
 *             type: string
 *             format: password
 *           phone:
 *             description: "The Customer's phone number."
 *             type: string
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer:
 *               $ref: "#/components/schemas/customer"
 *   422:
 *     description: A customer with the same email exists
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             code:
 *               type: string
 *               description: The error code
 *             type:
 *               type: string
 *               description: The type of error
 *             message:
 *               type: string
 *               description: Human-readable message with details about the error
 *         example:
 *           code: "invalid_request_error"
 *           type: "duplicate_error"
 *           message: "A customer with the given email already has an account. Log in instead"
 */
export default async (req, res) => {
  const validated = await validator(StorePostCustomersReq, req.body)

  const customerService: CustomerService = req.scope.resolve("customerService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    await customerService.withTransaction(transactionManager).create(validated)
  })

  const authService: AuthService = req.scope.resolve("authService")
  const authStrategy = await authService.retrieveAuthenticationStrategy(
    req,
    "store"
  )

  req.retrieveConfig = {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  }

  const { email, password } = validated
  req.body = { email, password }

  await authStrategy.authenticate(req, res)
}

export class StorePostCustomersReq {
  @IsString()
  first_name: string

  @IsString()
  last_name: string

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsOptional()
  @IsString()
  phone?: string
}
