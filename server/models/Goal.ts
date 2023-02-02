import { Schema, model, Types } from "mongoose";
import { Workout } from "./index";
import { WorkoutMethodArray } from "./Workout";
import { WorkoutMethodType } from "../../client/src/Redux/slices/workoutSlice";

// -- Goal Types -- //
export interface GoalType {
  _id: Types.ObjectId;
  accountId: Types.ObjectId;
  workoutId: Types.ObjectId;
  method: WorkoutMethodType;
  achieved: Boolean;
  achievedDate: Date | null;
  targetRounds: number;
  targetWeight: number;
  targetSets: number;
  targetReps: number;
  successSetsReps: boolean;
}

const GoalSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    workoutId: { type: Schema.Types.ObjectId, ref: "Workout", required: true },
    method: {
      type: String,
      required: true,
      enum: WorkoutMethodArray,
    },
    achieved: {
      type: Boolean,
      default: false,
      required: true,
    },
    dateAchieved: {
      type: Date,
      default: Date.now(),
      required: true,
      get: (date: Date) => {
        if (typeof date === null) {
          return;
        }
        return `${date.toLocaleDateString("en-US")}`;
      },
    },
    targetRounds: {
      type: Number,
      default: 6,
      required: true,
    },
    targetSets: {
      type: Number,
      default: 0,
      required: true,
    },
    targetWeight: {
      type: Number,
      default: 0,
      required: true,
    },
    targetReps: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

GoalSchema.post("save", async function (doc) {
  try {
    await Workout.findByIdAndUpdate(
      this.workoutId,
      {
        $addToSet: { goalId: this._id },
      },
      { new: true }
    );
  } catch (err) {
    throw new Error("Could not add GoalId to account");
  }
});

GoalSchema.post(new RegExp("delete", "i"), async function (doc) {
  try {
    await Workout.findByIdAndUpdate(
      doc.workoutId,
      {
        $pull: { goalId: doc._id },
      },
      { new: true }
    );
  } catch (err) {
    throw new Error("Could not delete GoalId to account");
  }
});

const Goal = model("Goal", GoalSchema);

export default Goal;
