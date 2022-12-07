import { Account } from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const createAccount = async (req: Request, res: Response) => {
  try {
    const createQuery = await Account.create(req.body);
    if (!createQuery)
      return res
        .status(500)
        .json({ error: true, msg: "Could not create account" });
    return res.status(200).json({ msg: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Counld to create account" });
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
    const getByIdQuery = await Account.findById(res.locals.cookie._id, {
      password: 0,
    }).populate({
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

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      req.body._id,
      req.body,
      { fields: { password: 0 }, new: true }
    );
    if (!updatedAccount)
      return res.status(404).json({ error: true, msg: "No Account found" });
    res.status(200).json({ payload: updatedAccount });
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

export const authenticateLogin = async (req: Request, res: Response) => {
  const foundAccount = await Account.findOne({ email: req.body.email });

  if (!foundAccount)
    return res.status(401).json({ error: true, msg: "Login failed." });

  const isValid = await bcrypt.compare(
    req.body.password,
    foundAccount.password
  );

  if (!isValid)
    return res.status(401).json({ error: true, msg: "Login failed." });

  const token = jwt.sign(
    {
      _id: foundAccount._id,
      email: foundAccount.email,
      role: foundAccount.role,
    },
    process.env.SECRET_KEY!
  );

  if (process.env.NODE_ENV === "production") {
    res.cookie("token", token, {
      secure: true,
    });
  } else {
    res.cookie("token", token, { secure: false });
  }

  // Extract password key from the foundAccount object
  const { password, ...accountData } = foundAccount;

  res.status(200).json({ msg: "successful login" });
};
