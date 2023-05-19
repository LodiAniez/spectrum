import { Request, Response } from "express"
import { Send, Query } from "express-serve-static-core"

export interface TRequest<T = any, Q extends Query = any> extends Request {
  body: T
  query: Q
}

export interface TResponse<T = any, S = any> extends Response {
  json: Send<T, this>
  send: Send<S, this>
}
