import { Schema, model, Types } from "mongoose";
import { Account, Round } from "./index";

// -- Workout Types -- //
export interface WorkoutType {
  _id?: string | Types.ObjectId;
  accountId: string | Types.ObjectId;
  roundId: string[] | Types.ObjectId[] | [];
  name: string;
  muscleCategory: WorkoutMuscleCategoryType;
  muscleGroup: MuscleGroupType;
  methodSelection: WorkoutMethodType[] | [];
}

export type WorkoutMuscleCategoryType =
  | "Upper Body"
  | "Lower Body"
  | "Core"
  | "";
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

const WorkoutSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    roundId: [{ type: Schema.Types.ObjectId, ref: "Round", default: [] }],
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
        enum: ["Barbell", "Cable", "Dumbbell", "Machine"],
      },
    ],
    videoUrl: {
      type: String,
      required: false,
    },
  },
  {
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
    await Round.deleteMany({ workoutId: doc._id }, { new: true });
  } catch (err) {
    throw new Error("Could not delete workoutId to account");
  }
});

const Workout = model("Workout", WorkoutSchema);

export default Workout;
