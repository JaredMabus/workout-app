import { Types } from "mongoose";
import { Round } from "../models";
import { RoundType } from "../models/Round";
import { subDays, subMonths, format } from "date-fns";

const today = new Date();

const data: Partial<RoundType>[] = [
  {
    _id: new Types.ObjectId("63f7c62a02dd894318d81e67"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: subDays(today, 20),
    method: "Barbell",
    sets: [
      { weight: 115, reps: 8, datetime: subDays(today, 20) },
      { weight: 115, reps: 8, datetime: subDays(today, 20) },
      { weight: 115, reps: 8, datetime: subDays(today, 20) },
    ],
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("63b5db577835ecd77f122c4b"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: subDays(today, 18),
    method: "Barbell",
    sets: [
      { weight: 115, reps: 8, datetime: subDays(today, 18) },
      { weight: 115, reps: 8, datetime: subDays(today, 18) },
      { weight: 115, reps: 8, datetime: subDays(today, 18) },
    ],
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("63b5db73b84507cab166c368"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: subDays(today, 16),
    method: "Barbell",
    sets: [
      { weight: 115, reps: 8, datetime: subDays(today, 16) },
      { weight: 115, reps: 8, datetime: subDays(today, 16) },
      { weight: 115, reps: 8, datetime: subDays(today, 16) },
    ],
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("63b5db79fda0415eb2fcc3c3"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: subDays(today, 14),
    method: "Barbell",
    sets: [
      { weight: 120, reps: 8, datetime: subDays(today, 14) },
      { weight: 120, reps: 8, datetime: subDays(today, 14) },
      { weight: 120, reps: 7, datetime: subDays(today, 14) },
    ],
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("6390ee5a265387621e381f64"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: subDays(today, 12),
    method: "Barbell",
    sets: [
      { weight: 120, reps: 8, datetime: subDays(today, 12) },
      { weight: 120, reps: 8, datetime: subDays(today, 12) },
      { weight: 120, reps: 7, datetime: subDays(today, 12)},
    ],
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("6390eecd5dc8f56fa0d58fd4"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: subDays(today, 10),
    method: "Barbell",
    sets: [
      { weight: 120, reps: 8, datetime: subDays(today, 10) },
      { weight: 120, reps: 8, datetime: subDays(today, 10) },
      { weight: 120, reps: 7, datetime: subDays(today, 10) },
    ],
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("63ab45d0ab304c569f7511e7"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: subDays(today, 8),
    method: "Barbell",
    sets: [
      { weight: 120, reps: 8, datetime: subDays(today, 8)},
      { weight: 120, reps: 8, datetime: subDays(today, 8)},
      { weight: 120, reps: 7, datetime: subDays(today, 8)},
    ],
    successSetsReps: false,
  },
  {
    _id: new Types.ObjectId("63ab45daf117f5ae56347537"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: subDays(today, 6),
    method: "Barbell",
    sets: [
      { weight: 120, reps: 8, datetime: subDays(today, 6)},
      { weight: 120, reps: 8, datetime: subDays(today, 6)},
      { weight: 120, reps: 8, datetime: subDays(today, 6)},
    ],
    successSetsReps: true,
  },
  {
    _id: new Types.ObjectId("63ab46108fa78c263aacfd89"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: subDays(today, 3),
    method: "Barbell",
    sets: [
      { weight: 120, reps: 8, datetime: subDays(today, 3)},
      { weight: 120, reps: 8, datetime: subDays(today, 3)},
      { weight: 120, reps: 8, datetime: subDays(today, 3)},
    ],
    successSetsReps: true,
  },
  // {
  //   _id: new Types.ObjectId("63ab461533e0fdc29086ae7e"),
  //   accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
  //   workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
  //   date: subDays(today, 2),
  //   method: "Barbell",
  //   sets: [
  //     { weight: 120, reps: 8, datetime: new Date("12/16/2022 15:30:00") },
  //     { weight: 120, reps: 8, datetime: new Date("12/16/2022 15:31:00") },
  //     { weight: 120, reps: 8, datetime: new Date("12/16/2022 15:32:00") },
  //   ],
  //   successSetsReps: false,
  // },
  {
    _id: new Types.ObjectId("639cc2eb585b878f06473c53"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    date: subDays(today, 28),
    method: "Dumbbell",
    sets: [
      { weight: 45, reps: 8, datetime: new Date("12/17/2022 15:30:00") },
      { weight: 45, reps: 8, datetime: new Date("12/17/2022 15:31:00") },
      { weight: 45, reps: 8, datetime: new Date("12/17/2022 15:32:00") },
    ],
    successSetsReps: false,
  },
];

export default async function seed() {
  const queryFirst = await Round.find({});
  if (queryFirst && queryFirst.length === 0) {
    console.log("--- Seeding Rounds...");
    await Round.insertMany(data);
    console.table(data, ["_id", "workoutId", "date", "method", "sets"]);
    console.log(`${data.length} Rounds seeded successfully! \n\n`);
  } else {
    console.log("Round data exist, no seeding needed");
  }
}
