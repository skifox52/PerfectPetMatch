import { ErrorRequestHandler, Request, Response, NextFunction } from "express"

const ErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    err: err.message,
    stack: err.stack,
  })
}

export default ErrorHandler
