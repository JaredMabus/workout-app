import { Types } from "mongoose";
import { Goal } from "../models";
import { GoalType } from "../models/Goal";

const data: Partial<GoalType>[] = [
  {
    _id: new Types.ObjectId("63b5d2af95f2d6086d327dee"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    method: "Barbell",
    targetRounds: 6,
    targetSets: 3,
    targetWeight: 120,
    targetReps: 8,
  },
  {
    _id: new Types.ObjectId("63b5d4dffaaae1e0b1946cf8"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    method: "Dumbbell",
    targetRounds: 6,
    targetSets: 3,
    targetWeight: 45,
    targetReps: 8,
  },
];

export default async function seed() {
  const queryFirst = await Goal.find({});
  if (queryFirst && queryFirst.length === 0) {
    console.log("--- Seeding Goals...");
    await Goal.insertMany(data);
    console.table(data, [
      "_id",
      "workoutId",
      "date",
      "method",
      "targetRounds",
      "targetSets",
      "targetWeight",
      "targetReps",
    ]);
    console.log(`${data.length} Goals seeded successfully! \n\n`);
  } else {
    console.log("Goal data exist, no seeding needed");
  }
}
