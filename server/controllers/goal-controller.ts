import { Goal } from "../models";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const createGoal = async (req: Request, res: Response) => {
  try {
    const createQuery = await Goal.create(req.body);
    if (!createQuery)
      return res
        .status(500)
        .json({ error: true, msg: "Could not create goal" });
    return res.status(200).json({ msg: "success", payload: createQuery });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Counld to create goal" });
  }
};

export const getAllGoals = async (req: Request, res: Response) => {
  try {
    const getAllQuery = await Goal.find({});

    res.status(200).json({ payload: getAllQuery });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

export const getGoalById = async (req: Request, res: Response) => {
  try {
    const getByIdQuery = await Goal.findById(req.params.id);

    if (!getByIdQuery)
      return res
        .status(404)
        .json({ error: true, msg: "No Goal found by that id" });

    return res.status(200).json({ payload: getByIdQuery });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: true, msg: "No Goal found by that id" });
  }
};

export const getLoggedInGoalData = async (req: Request, res: Response) => {
  try {
    const getByIdQuery = await Goal.find({ accountId: res.locals.cookie._id });

    if (!getByIdQuery)
      return res
        .status(400)
        .json({ error: true, msg: "No Goal found by that id" });

    return res.status(200).json({ payload: getByIdQuery });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: true, msg: "Could not search database " });
  }
};

export const updateGoal = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const updatedGoal = await Goal.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    if (!updatedGoal)
      return res.status(404).json({ error: true, msg: "No Goal found" });
    res.status(200).json({ payload: updatedGoal });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Goal could not be updated" });
  }
};

export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const deleteQuery = await Goal.findByIdAndDelete(req.params.id);
    if (!deleteQuery)
      return res.status(404).json({ error: true, msg: "No Goal found" });

    res.status(200).json({ msg: "Goal successfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Goal could not be deleted" });
  }
};
