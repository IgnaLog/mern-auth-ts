import { Request, Response, NextFunction } from "express";
import { logEvents } from "./logEvents";

const errorHandle = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.log(err.stack);
  res.status(500).send(err.message);
};

export default errorHandle;
