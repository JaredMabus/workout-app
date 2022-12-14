import { Router, Request, Response, NextFunction } from "express";
import { Account } from "../../models";
import signToken, { accountFields } from "../../utils/accountPayload";
import jwt from "jsonwebtoken";
import s3ServiceMW from "../middleware/s3-service";

const router = Router();

/**
 * /put
 *  1. s3Service
 *  2. Update mongo controler
 *  3. Update cookie token middleware
 */

router.put(
  "/avatar",
  s3ServiceMW,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Update Account data
      const query = await Account.findByIdAndUpdate(
        res.locals.cookie.accountData._id,
        { avatar: res.locals.newAvatar },
        accountFields
      );

      if (
        !query ||
        res.locals.newAvatar.length === 0 ||
        res.locals.newAvatar === undefined
      )
        return res.status(500).json({
          error: true,
          msg: "Uploaded to S3 but could not update image url",
        });

      // Update Cookie token
      const token = signToken(query);

      if (process.env.NODE_ENV === "production") {
        res.cookie("token", token, {
          secure: true,
        });
      } else {
        res.cookie("token", token, { secure: false });
      }

      return res
        .status(200)
        .json({ msg: "success", payload: res.locals.newAvatar });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
