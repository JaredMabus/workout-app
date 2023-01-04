import { Workout } from "../models";
import { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose, { Types } from "mongoose";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
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
          from: "goals",
          localField: "goalId",
          foreignField: "_id",
          as: "goalId",
          pipeline: [
            {
              $group: {
                _id: "$method",
                createAt: { $max: "$createdAt" },
                values: {
                  $topN: {
                    output: {
                      _id: "$_id",
                      achieved: "$achieved",
                      dateAchieved: "$dateAchieved",
                      targetWeight: "$targetWeight",
                      targetSets: "$targetSets",
                      targetReps: "$targetReps",
                    },
                    sortBy: { createdBy: -1 },
                    n: 1,
                  },
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "rounds",
          localField: "_id",
          foreignField: "workoutId",
          let: {
            weightIncrease: "$targetGoal.weightIncrease",
            setIncrease: "$targetGoal.setIncrease",
            repIncrease: "$targetGoal.repIncrease",
          },
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
                totalRounds: { $count: {} },
                rounds: {
                  $topN: {
                    output: {
                      _id: "$_id",
                      // accountId: "$accountId",
                      // workoutId: "$workoutId",
                      date: "$date",
                      // method: "$method",
                      weight: "$weight",
                      sets: "$sets",
                      reps: "$reps",
                      successSetsReps: "$successSetsReps",
                      // createdAt: "$createdAt",
                      // updatedAt: "$updatedAt",
                    },
                    sortBy: { date: -1 },
                    n: 9,
                  },
                },
                // rounds: {
                //   $push: {
                //     _id: "$_id",
                //     accountId: "$accountId",
                //     workoutId: "$workoutId",
                //     date: "$date",
                //     method: "$method",
                //     weight: "$weight",
                //     sets: "$sets",
                //     reps: "$reps",
                //     successSets: "$successSetsReps",
                //     createdAt: "$createdAt",
                //     updatedAt: "$updatedAt",
                //   },
                // },
              },
            },
            // {
            //   $group: {
            //     _id: "$rounds",
            //     targetWeight: { $max: "$weight" },
            //     targetSet: { $max: "$sets" },
            //     targetRep: { $max: "$weight" },
            //   },
            // },
            // {
            //   $addFields: {
            //     goalByMethod: {
            //       targetWeight: { $add: ["$lastWeight", "$$weightIncrease"] },
            //       targetSet: { $add: ["$lastSets", "$$setIncrease"] },
            //       targetRep: { $add: ["$lastReps", "$$repIncrease"] },
            //     },
            //   },
            // },
          ],
        },
      },
    ]);

    if (!query)
      return res
        .status(404)
        .json({ error: true, msg: "Could not find workout data" });

    res.status(200).json({ payload: query });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: true, msg: "Oops, could not retrieve workout data" });
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

    const data = await Workout.aggregate([
      {
        $match: {
          _id: updatedWorkout._id,
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
    res.status(200).json({ payload: data[0] });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Workout could not be updated" });
  }
};

export const deleteWorkout = async (req: Request, res: Response) => {
  try {
    const deleteQuery = await Workout.findOneAndDelete({
      _id: req.body._id,
      accountId: res.locals.cookie.accountData._id,
    });
    if (!deleteQuery)
      return res.status(403).json({ error: true, msg: "No Workout found" });

    res
      .status(200)
      .json({ msg: "Workout successfully deleted", payload: deleteQuery });
  } catch (err) {
    return res
      .status(400)
      .json({ error: true, msg: "Workout could not be deleted" });
  }
};
