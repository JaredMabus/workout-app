import { Workout } from "../models";
import { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose, { Types } from "mongoose";
dotenv.config();

export const createWorkout = async (req: Request, res: Response) => {
  try {
    const createQuery = await Workout.create(req.body);
    if (!createQuery)
      return res
        .status(500)
        .json({ error: true, msg: "Could not create workout" });
    return res.status(200).json({ msg: "success", payload: createQuery });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Counld to create workout" });
  }
};

export const getAllWorkouts = async (req: Request, res: Response) => {
  try {
    const getAllQuery = await Workout.find({});

    res.status(200).json({ payload: getAllQuery });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

export const getWorkoutById = async (req: Request, res: Response) => {
  try {
    const getByIdQuery = await Workout.findById(req.params.id, {
      password: 0,
    });

    if (!getByIdQuery)
      return res
        .status(404)
        .json({ error: true, msg: "No workout found by that id" });

    res.status(200).json({ payload: getByIdQuery });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "No Workout found by that id" });
  }
};

export const getLoggedInWorkoutData = async (req: Request, res: Response) => {
  try {
    const query = await Workout.aggregate([
      {
        $match: {
          accountId: new Types.ObjectId(res.locals.cookie.accountData._id),
        },
      },
      {
        $lookup: {
          from: "rounds",
          localField: "_id",
          foreignField: "workoutId",
          as: "roundId",
        },
      },
      {
        $lookup: {
          from: "rounds",
          localField: "_id",
          foreignField: "workoutId",
          as: "lastRounds",
          pipeline: [
            {
              $group: {
                _id: "$method",
                lastWeight: { $last: "$weight" },
                lastSets: { $last: "$sets" },
                lastReps: { $last: "$reps" },
                successSetsReps: { $last: "$successSetsReps" },
                startDate: { $min: "$date" },
                mostRecent: { $max: "$date" },
                count: { $count: {} },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    if (!query)
      return res
        .status(404)
        .json({ error: true, msg: "No workout found by that id" });

    res.status(200).json({ payload: query });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "No Workout found by that id" });
  }
};

export const updateWorkout = async (req: Request, res: Response) => {
  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.body._id,
      req.body,
      { new: true }
    );
    if (!updatedWorkout)
      return res.status(404).json({ error: true, msg: "No Workout found" });
    res.status(200).json({ payload: updatedWorkout });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Workout could not be updated" });
  }
};

export const deleteWorkout = async (req: Request, res: Response) => {
  try {
    const deleteQuery = await Workout.findByIdAndDelete(req.params.id);
    if (!deleteQuery)
      return res.status(404).json({ error: true, msg: "No Workout found" });

    res.status(200).json({ msg: "Workout successfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Workout could not be deleted" });
  }
};
