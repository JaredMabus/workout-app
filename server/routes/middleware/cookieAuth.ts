import { Request, Response, NextFunction } from "express";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function cookieAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.headers || !req.headers.cookie) return res.sendStatus(403);
    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies["token"];
    const secret = process.env.SECRET_KEY;

    if (secret) {
      jwt.verify(token, secret, (err: any, payload: any) => {
        if (err) return res.sendStatus(403);
        res.locals.cookie = payload;
        next();
      });
    } else {
      res.status(500);
      throw new Error("Server environment variable error");
    }
  } catch (err) {
    res.status(500);
    next(err);
  }
}
