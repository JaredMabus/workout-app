import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";
import S3 from "../libs/S3";

export interface AccountType {
  _id: string | Types.ObjectId | null;
  workoutId: Types.ObjectId[] | [] | null;
  workoutPlanWeek: WorkoutPlanDays | null;
  email: string | null;
  password: string | null;
  fname: string | null;
  lname: string | null;
  role: string | null;
  gender: string | null;
  weight: number | null;
  height: number | null;
  avatar: string | null;
}

export type WorkoutPlanWeek = WorkoutPlanDays[];
export interface WorkoutPlanDays {
  0: string[];
  1: string[];
  2: string[];
  3: string[];
  4: string[];
  5: string[];
  6: string[];
}
export type WeekDayNumber = "0" | "1" | "2" | "3" | "4" | "5" | "6";

const AccountSchema = new Schema(
  {
    workoutId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Workout",
        default: [],
      },
    ],
    workoutPlanWeek: {
      "0": {
        type: Array,
        required: true,
        default: [],
      },
      "1": {
        type: Array,
        required: true,
        default: [],
      },
      "2": {
        type: Array,
        required: true,
        default: [],
      },
      "3": {
        type: Array,
        required: true,
        default: [],
      },
      "4": {
        type: Array,
        required: true,
        default: [],
      },
      "5": {
        type: Array,
        required: true,
        default: [],
      },
      "6": {
        type: Array,
        required: true,
        default: [],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "not a valid email",
      ],
    },
    password: { type: String, required: true },
    fname: { type: String, default: "New", required: true },
    lname: { type: String, default: "Account" },
    role: {
      type: String,
      enum: ["admin", "client", "trainer"],
      default: "client",
    },
    avatar: {
      type: String,
      required: false,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", null],
      default: null,
    },
    weight: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

AccountSchema.pre("validate", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

AccountSchema.post(new RegExp("delete", "i"), async function (doc) {
  try {
    const s3 = new S3(doc.avatar, undefined, doc._id);
    const deleteFile = await s3.deleteFile(doc.avatar);
    console.log("Account and S3 avatar deleted");
  } catch (err) {
    throw new Error("Could not delete RoundId to account");
  }
});

const Account = model("Account", AccountSchema);

export default Account;
