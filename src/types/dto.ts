import { Request, Response } from "express"
import { Send, ParamsDictionary } from "express-serve-static-core"
import { User as UserModel } from "@prisma/client"

/**
 *
 * @param T for `req.body` type
 * @param P for `req.params` type
 * @param U for `req.user` which will only exist if a valid auth token is provided from header
 */
export interface TRequest<
  T = any,
  P extends ParamsDictionary = { [key: string]: string },
  U = UserModel
> extends Request {
  body: T
  params: P
  user?: U
}

/**
 *
 * @param T for `res.json` response type
 * @param S for `res.send` response type
 */
export interface TResponse<T = any, S = any> extends Response {
  json: Send<T, this>
  send: Send<S, this>
}
