import { Account } from "../models";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const planFields = {
  select: {
    _id: 1,
    name: 1,
    muscleCategory: 1,
    muscleGroup: 1,
    methodSelection: 1,
  },
};

export const getWorkoutPlanWeek = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workoutPlanQuery = await Account.findById(
      {
        _id: res.locals.cookie.accountData._id,
      },
      { workoutPlanWeek: 1, _id: 0 }
    )
      .populate({
        path: "workoutPlanWeek.0",
        // ...planFields,
      })
      .populate({
        path: "workoutPlanWeek.1",
        // ...planFields,
      })
      .populate({
        path: "workoutPlanWeek.2",
        // ...planFields,
      })
      .populate({
        path: "workoutPlanWeek.3",
        // ...planFields,
      })
      .populate({
        path: "workoutPlanWeek.4",
        // ...planFields,
      })
      .populate({
        path: "workoutPlanWeek.5",
        // ...planFields,
      })
      .populate({
        path: "workoutPlanWeek.6",
        // ...planFields,
      });
    if (!workoutPlanQuery)
      return res.status(403).json({ error: true, msg: "No Plan Plan" });

    res.status(200).json({ msg: "success", payload: workoutPlanQuery });
  } catch (err) {
    return res
      .status(400)
      .json({ error: true, msg: "Plan could not be retrieved" });
  }
};

export const addWorkoutToPlan = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ payload: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Plan could not be updated" });
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    const updateQuery = await Account.findByIdAndUpdate(
      res.locals.cookie.accountData._id,
      {
        $set: { workoutPlanWeek: req.body },
      }
    );

    res.status(200).json({ payload: updateQuery });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Plan could not be updated" });
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const deleteQuery = await Account.findByIdAndUpdate({
      _id: req.body._id,
      accountId: res.locals.cookie.accountData._id,
    });
    if (!deleteQuery)
      return res.status(403).json({ error: true, msg: "No Plan found" });

    res
      .status(200)
      .json({ msg: "Plan successfully deleted", payload: deleteQuery });
  } catch (err) {
    return res
      .status(400)
      .json({ error: true, msg: "Plan could not be deleted" });
  }
};
