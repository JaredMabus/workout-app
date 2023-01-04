import { Types } from "mongoose";
import { Workout } from "../models";
import { WorkoutModelType } from "../models/Workout";
import { TargetGoalType } from "../../client/src/Redux/slices/workoutSlice";

const data: WorkoutModelType[] = [
  {
    _id: new Types.ObjectId("638fa91fbd7c62d1aae60464"),
    accountId: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    goalId: [
      new Types.ObjectId("63b5d2af95f2d6086d327dee"),
      new Types.ObjectId("63b5d4dffaaae1e0b1946cf8"),
    ],
    roundId: [
      new Types.ObjectId("63b5db577835ecd77f122c4b"),
      new Types.ObjectId("63b5db73b84507cab166c368"),
      new Types.ObjectId("63b5db79fda0415eb2fcc3c3"),
      new Types.ObjectId("6390ee5a265387621e381f64"),
      new Types.ObjectId("6390eecd5dc8f56fa0d58fd4"),
      new Types.ObjectId("63ab45d0ab304c569f7511e7"),
      new Types.ObjectId("63ab45daf117f5ae56347537"),
      new Types.ObjectId("63ab46108fa78c263aacfd89"),
      new Types.ObjectId("63ab461533e0fdc29086ae7e"),
      new Types.ObjectId("639cc2eb585b878f06473c53"),
    ],
    name: "Bench Press",
    muscleCategory: "Upper Body",
    muscleGroup: "Chest",
    methodSelection: ["Barbell", "Dumbbell", "Machine"],
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
