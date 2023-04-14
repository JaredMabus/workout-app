import { Schema, model, Types } from "mongoose";
import { Account } from "./index";

export type MuscleCategoryType = "Upper Body" | "Lower Body" | "Core" | "";
export type MuscleGroupType =
  | "Chest"
  | "Legs"
  | "Glutes"
  | "Shoulder"
  | "Back"
  | "Front Arm"
  | "Back Arm"
  | "Abs";

export type WorkoutMethodType =
  | "Barbell"
  | "Cable"
  | "Dumbbell"
  | "Machine"
  | "";
// -- Workout Types -- //
export interface WorkoutModelType {
  _id?: Types.ObjectId;
  accountId: Types.ObjectId;
  roundId: Types.ObjectId[] | [];
  goalId?: Types.ObjectId[] | [];
  name: string;
  muscleCategory: MuscleCategoryType;
  muscleGroup: MuscleGroupType;
  methodSelection: WorkoutMethodType[];
}

const GoalSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  startWeight: {
    type: Number,
    required: true,
    default: 0,
  },
  startSet: {
    type: Number,
    required: true,
    default: 0,
  },
  startRep: {
    type: Number,
    required: true,
    default: 0,
  },
  endWeight: {
    type: Number,
    required: true,
    default: 0,
  },
  endSet: {
    type: Number,
    required: true,
    default: 0,
  },
  endRep: {
    type: Number,
    required: true,
    default: 0,
  },
});

const TargetGoalSchema = new Schema(
  {
    weightIncrease: {
      type: Number,
      required: true,
      default: 5,
    },
    setIncrease: {
      type: Number,
      required: true,
      default: 0,
    },
    repIncrease: {
      type: Number,
      required: true,
      default: 0,
    },
    roundGoal: {
      type: Number,
      required: true,
      default: 6,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

export const WorkoutMethodArray = ["Barbell", "Cable", "Dumbbell", "Machine"];

const WorkoutSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    goalId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Goal",
        required: true,
        default: [],
      },
    ],
    roundId: [{ type: Schema.Types.ObjectId, ref: "Round", default: [] }],
    targetGoal: { type: TargetGoalSchema, default: () => ({}) },
    name: {
      type: String,
      required: true,
    },
    muscleCategory: {
      type: String,
      required: true,
    },
    muscleGroup: {
      type: String,
      required: true,
    },
    methodSelection: [
      {
        type: String,
        required: true,
        enum: WorkoutMethodArray,
      },
    ],
    videoUrl: {
      type: String,
      required: false,
    },
  },
  {
    toJson: { virtuals: true },
    timestamps: true,
  }
);

WorkoutSchema.post("save", async function (doc) {
  try {
    doc.methodSelection.sort();
    await Account.findByIdAndUpdate(
      this.accountId,
      {
        $addToSet: { workoutId: this._id },
      },
      { new: true }
    );
  } catch (err) {
    throw new Error("Could not add workoutId to account");
  }
});

WorkoutSchema.post(new RegExp("delete", "i"), async function (doc) {
  try {
    await Account.findByIdAndUpdate(
      doc.accountId,
      {
        $pull: { workoutId: doc._id },
      },
      { new: true }
    );
  } catch (err) {
    throw new Error("Could not delete workoutId to account");
  }
});
// WorkoutSchema.post(new RegExp("delete", "i"), async function (doc) {
//   try {
//     await Account.findByIdAndUpdate(
//       doc.accountId,
//       {
//         $pull: { workoutId: doc._id },
//       },
//       { new: true }
//     );
//   } catch (err) {
//     throw new Error("Could not delete workoutId to account");
//   }
// });

const Workout = model("Workout", WorkoutSchema);
// const Goal = model("Goal", GoalSchema);

export default Workout;
