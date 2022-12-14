import {
  AccountInfo,
  AccountStateType,
} from "../../client/src/Redux/slices/accountSlice";
import { Account } from "../models";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function signToken(query: any) {
  return jwt.sign(accountPayload(query), process.env.SECRET_KEY!);
}

export function accountPayload(query: any) {
  return {
    loginStatus: true,
    accountData: {
      _id: query._id,
      email: query.email,
      fname: query.fname,
      lname: query.lname,
      avatar: query.avatar,
      height: query.height,
      weight: query.weight,
    },
  };
}

export const accountFields = {
  _id: 1,
  email: 1,
  password: 1,
  fname: 1,
  lname: 1,
  avatar: 1,
  height: 1,
  weight: 1,
  new: true,
};
