import { Schema, model, Types } from "mongoose";
import { Workout } from "./index";
import { WorkoutMethodType } from "./Workout";
// -- Round Types -- //
export interface RoundType {
  _id: Types.ObjectId;
  accountId: Types.ObjectId;
  workoutId: Types.ObjectId;
  date: Date;
  method: WorkoutMethodType;
  weight: number;
  sets: number;
  reps: number;
  successSetsReps: boolean;
}

const RoundSchema = new Schema(
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
    },
    date: {
      type: Date,
      default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
      required: true,
    },
    weight: {
      type: Number,
      default: 0,
      required: true,
    },
    sets: {
      type: Number,
      default: 0,
      required: true,
    },
    reps: {
      type: Number,
      default: 0,
      required: true,
    },
    successSetsReps: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

RoundSchema.post("save", async function (doc) {
  try {
    await Workout.findByIdAndUpdate(
      this.workoutId,
      {
        $addToSet: { roundId: this._id },
      },
      { new: true }
    );
  } catch (err) {
    throw new Error("Could not add RoundId to account");
  }
});

// RoundSchema.post(new RegExp("delete", "i"), async function (doc) {
//   try {
//     await Workout.findByIdAndUpdate(
//       doc.workoutId,
//       {
//         $pull: { roundId: doc._id },
//       },
//       { new: true }
//     );
//   } catch (err) {
//     throw new Error("Could not delete RoundId to account");
//   }
// });

const Round = model("Round", RoundSchema);

export default Round;
