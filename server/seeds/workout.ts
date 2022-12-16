import { Types } from "mongoose";
import { Workout } from "../models";
import { WorkoutType } from "../models/Workout";

const data: Partial<WorkoutType>[] = [
  {
    _id: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    roundId: [
      new Types.ObjectId("6390ee5a265387621e381f64"),
      new Types.ObjectId("6390eecd5dc8f56fa0d58fd4"),
    ],
    name: "Bench Press",
    muscleCategory: "Upper Body",
    muscleGroup: "Chest",
    methodSelection: ["Barbell", "Cable", "Dumbbell", "Machine"],
  },
  {
    _id: new Types.ObjectId("639a8040083fbf7cecfd6b2a"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    roundId: [],
    name: "Bicep Curl",
    muscleCategory: "Upper Body",
    muscleGroup: "Front Arm",
    methodSelection: ["Barbell", "Cable"],
  },
  {
    _id: new Types.ObjectId("639a804787b821790d9ad1f0"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    roundId: [],
    name: "Leg Press",
    muscleCategory: "Lower Body",
    muscleGroup: "Legs",
    methodSelection: ["Barbell", "Machine"],
  },
];

export default async function seed() {
  const queryFirst = await Workout.find({});
  if (queryFirst && queryFirst.length === 0) {
    console.log("--- Seeding Workouts...");
    await Workout.insertMany(data);
    console.table(data, [
      "_id",
      "name",
      "muscleCategory",
      "muscleGroup",
      "methodSelection",
    ]);
    console.log(`${data.length} Workouts seeded successfully! \n\n`);
  } else {
    console.log("Workout data exist, no seeding needed");
  }
}
