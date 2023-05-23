import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/dotenv";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (typeof authHeader !== "string" || !authHeader?.startsWith("Bearer "))
    return res.sendStatus(401); // Unauthorized
  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = await jwt.verify(token, ACCESS_TOKEN_SECRET as Secret);
    req.user = decoded.userInfo.username;
    req.roles = decoded.userInfo.roles;
    next();
  } catch (err) {
    return res.sendStatus(403); // Invalid token
  }
};

export default verifyJWT;
