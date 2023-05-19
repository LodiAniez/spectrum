import { Request, Response } from "express"
import { Send, ParamsDictionary } from "express-serve-static-core"

/**
 *
 * @param T for `req.body` type
 * @param P for `req.params` type
 */
export interface TRequest<
  T = any,
  P extends ParamsDictionary = { [key: string]: string }
> extends Request {
  body: T
  params: P
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
