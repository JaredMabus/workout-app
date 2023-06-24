import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { subMonths } from "date-fns";

export const workoutAgg = (res: Response) => {
  let aggArray = [
    {
      $match: {
        accountId: new Types.ObjectId(res.locals.cookie.accountData._id),
      },
    },
    {
      $lookup: {
        from: "rounds",
        localField: "roundId",
        foreignField: "_id",
        as: "roundId",
        let: {
          name: "$name",
        },
        pipeline: [
          {
            $project: {
              _id: 1,
              accountId: 1,
              workoutId: 1,
              method: 1,
              date: 1,
              sets: 1,
              successfulSetsReps: 1,
              createAt: 1,
              updatedAt: 1,
              name: "$$name",
            },
          },
        ],
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
              id: { $last: "$_id" },
              method: { $last: "$method" },
              createAt: { $last: "$createdAt" },
              achieved: { $last: "$achieved" },
              dateAchieved: { $last: "$dateAchieved" },
              targetRounds: { $last: "$targetRounds" },
              targetWeight: { $last: "$targetWeight" },
              targetSets: { $last: "$targetSets" },
              targetReps: { $last: "$targetReps" },
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

              lastSets: { $last: { $size: "$sets" } },
              lastWeightRep: {
                $last: { $first: "$sets" },
              },
              successSetsReps: { $last: "$successSetsReps" },
              startDate: { $min: "$date" },
              mostRecent: { $max: "$date" },
              totalRounds: { $count: {} },
              rounds: {
                $topN: {
                  output: {
                    _id: "$_id",
                    date: "$date",
                    sets: "$sets",
                    successSetsReps: "$successSetsReps",
                  },
                  sortBy: { date: -1 },
                  n: 9,
                },
              },
            },
          },
          {
            $project: {
              _id: "$_id",
              lastSets: "$lastSets",
              lastWeight: "$lastWeightRep.weight",
              lastReps: "$lastWeightRep.reps",
              successSetsReps: "$successSetsReps",
              startDate: "$startDate",
              mostRecent: "$mostRecent",
              totalRounds: "$totalRounds",
              rounds: "$rounds",
            },
          },
        ],
      },
    },
  ];
  return aggArray;
};

export const workoutAggNorm = (res: Response) => {
  let aggArray = [
    {
      $match: {
        accountId: new Types.ObjectId(res.locals.cookie.accountData._id),
      },
    },
    {
      $project: {
        id: {
          $map: {
            input: "$_id",
            as: "workouts",
            in: { $toobjectId: "$$_id" },
          },
        },
      },
    },
  ];
  return aggArray;
};
