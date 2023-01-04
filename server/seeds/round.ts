import { Types } from "mongoose";
import { Round } from "../models";
import { RoundType } from "../models/Round";

const data: Partial<RoundType>[] = [
  {
    _id: new Types.ObjectId("63b5db577835ecd77f122c4b"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: new Date("12/28/2022"),
    method: "Barbell",
    weight: 120,
    sets: 3,
    reps: 8,
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("63b5db73b84507cab166c368"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: new Date("11/30/2022"),
    method: "Barbell",
    weight: 120,
    sets: 3,
    reps: 8,
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("63b5db79fda0415eb2fcc3c3"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: new Date("12/2/2022"),
    method: "Barbell",
    weight: 120,
    sets: 3,
    reps: 8,
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("6390ee5a265387621e381f64"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: new Date("12/5/2022"),
    method: "Barbell",
    weight: 120,
    sets: 3,
    reps: 8,
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("6390eecd5dc8f56fa0d58fd4"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: new Date("12/7/2022"),
    method: "Barbell",
    weight: 120,
    sets: 3,
    reps: 8,
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("63ab45d0ab304c569f7511e7"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: new Date("12/9/2022"),
    method: "Barbell",
    weight: 120,
    sets: 3,
    reps: 8,
    successSetsReps: false,
  },
  {
    _id: new Types.ObjectId("63ab45daf117f5ae56347537"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: new Date("12/12/2022"),
    method: "Barbell",
    weight: 120,
    sets: 3,
    reps: 8,
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("63ab46108fa78c263aacfd89"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: new Date("12/14/2022"),
    method: "Barbell",
    weight: 120,
    sets: 3,
    reps: 8,
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("63ab461533e0fdc29086ae7e"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: new Date("12/16/2022"),
    method: "Barbell",
    weight: 120,
    sets: 3,
    reps: 8,
    successSetsReps: false,
  },
  {
    _id: new Types.ObjectId("639cc2eb585b878f06473c53"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: new Date("12/17/2022"),
    method: "Dumbbell",
    weight: 30,
    sets: 3,
    reps: 8,
    successSetsReps: false,
  },
];

export default async function seed() {
  const queryFirst = await Round.find({});
  if (queryFirst && queryFirst.length === 0) {
    console.log("--- Seeding Rounds...");
    await Round.insertMany(data);
    console.table(data, [
      "_id",
      "workoutId",
      "date",
      "method",
      "weight",
      "sets",
      "reps",
    ]);
    console.log(`${data.length} Rounds seeded successfully! \n\n`);
  } else {
    console.log("Round data exist, no seeding needed");
  }
}
