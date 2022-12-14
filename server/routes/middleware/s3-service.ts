import { Request, Response, NextFunction } from "express";
import S3 from "../../libs/S3";
import dotenv from "dotenv";
dotenv.config();

export default async function s3ServiceMW(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (res.locals.cookie.accountData._id === undefined)
      return res
        .status(403)
        .json({ error: true, msg: "Need account info to upload" });

    if (!req.files) res.sendStatus(403);

    if (req.files && Array.isArray(req.files)) {
      const image = req.files[0];

      const s3 = new S3(
        image.originalname,
        image.buffer,
        res.locals.cookie.accountData._id
      );
      const uploadRes = await s3.uploadFile();

      if (uploadRes.$metadata.httpStatusCode !== 200)
        return res
          .status(403)
          .json({ error: true, msg: "Could not upload to S3" });

      try {
        if (
          res.locals.cookie.accountData.avatar ||
          res.locals.cookie.accountData.avatar.length > 0
        ) {
          await s3.deleteFile(res.locals.cookie.accountData.avatar);
        }
      } catch (err) {
        console.log(err);
      }

      // Update Account avatar image url
      res.locals.newAvatar = s3.url;
      next();
    }
  } catch (err) {
    next(err);
  }
}
