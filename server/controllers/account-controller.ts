import { Account } from "../models";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import signToken, {
  accountPayload,
  accountFields,
} from "../utils/accountPayload";
import dotenv from "dotenv";
dotenv.config();

export const authenticateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundAccount = await Account.findOne(
      {
        email: req.body.email,
      },
      accountFields
    );

    if (!foundAccount)
      return res
        .status(401)
        .json({ error: true, msg: "No account with that email." });

    const isValid = await bcrypt.compare(
      req.body.password,
      foundAccount.password
    );

    if (!isValid)
      return res
        .status(401)
        .json({ error: true, msg: "Incorrect email or password" });

    const token = signToken(foundAccount);
    if (process.env.NODE_ENV === "production") {
      res.cookie("token", token, {
        secure: true,
      });
    } else {
      res.cookie("token", token, { secure: false });
    }
    let data = accountPayload(foundAccount);
    res.status(200).json({ msg: "successful login", payload: data });
  } catch (err) {
    next(err);
  }
};

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = await Account.create(req.body);
    const token = signToken(query);
    if (process.env.NODE_ENV === "production") {
      res.cookie("token", token, {
        secure: true,
      });
    } else {
      res.cookie("token", token, { secure: false });
    }
    let data = accountPayload(query);
    res.status(200).json({ msg: "success", payload: data });
  } catch (err) {
    next(err);
  }
};

export const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const getAllQuery = await Account.find({}, { password: 0 });

    res.status(200).json({ payload: getAllQuery });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

export const getAccountById = async (req: Request, res: Response) => {
  try {
    const getByIdQuery = await Account.findById(req.params.id, {
      password: 0,
    });

    if (!getByIdQuery)
      return res
        .status(404)
        .json({ error: true, msg: "No account found by that id" });

    res.status(200).json({ payload: getByIdQuery });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, msg: "No Account found by that id" });
  }
};

export const getLoggedInAccountData = async (req: Request, res: Response) => {
  try {
    const getByIdQuery = await Account.findById(
      res.locals.cookie.accountData._id,
      {
        password: 0,
      }
    ).populate({
      path: "workoutId",
      model: "Workout",
      populate: {
        path: "roundId",
        model: "Round",
      },
    });

    if (!getByIdQuery)
      return res
        .status(404)
        .json({ error: true, msg: "No account found by that id" });

    res.status(200).json({ payload: getByIdQuery });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "No Account found by that id" });
  }
};

export const updateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      res.locals.cookie.accountData._id,
      req.body,
      accountFields
    );
    if (!updatedAccount)
      return res.status(404).json({ error: true, msg: "No Account found" });

    const token = signToken(updatedAccount);
    if (process.env.NODE_ENV === "production") {
      res.cookie("token", token, {
        secure: true,
      });
    } else {
      res.cookie("token", token, { secure: false });
    }
    let data = accountPayload(updatedAccount);
    res.status(200).json({ payload: data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Account could not be updated" });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const deleteQuery = await Account.findByIdAndDelete(req.params.id);
    if (!deleteQuery)
      return res.status(404).json({ error: true, msg: "No Account found" });

    res.status(200).json({ msg: "Account successfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Account could not be deleted" });
  }
};
