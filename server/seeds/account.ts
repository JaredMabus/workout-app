import { Types } from "mongoose";
import { Account } from "../models/index";
import { AccountType } from "../models/Account";

const data: Partial<AccountType>[] = [
  {
    _id: new Types.ObjectId("63813132dc1a66e9faa840f3"),
    workoutId: [
      new Types.ObjectId("638fa91fbd7c62d1aae60464"),
      new Types.ObjectId("639a8040083fbf7cecfd6b2a"),
      new Types.ObjectId("639a804787b821790d9ad1f0"),
    ],
    email: "test@123.com",
    password: "password",
    fname: "Sarah",
    lname: "Test",
    gender: "female",
  },
  {
    _id: new Types.ObjectId("638e83793a12f57396830444"),
    email: "test1@123.com",
    password: "password",
    fname: "Bill",
    lname: "Tester",
    gender: "male",
  },
  {
    _id: new Types.ObjectId("638f71b0dd646c6693436eb4"),
    email: "test2@123.com",
    password: "password",
    fname: "Nancy",
    lname: "Tester",
    gender: "female",
  },
  {
    _id: new Types.ObjectId("638f87c0aae2572c461db5d2"),
    email: "delete@123.com",
    password: "password",
    fname: "Delete",
    lname: "Tester",
    gender: "male",
  },
];

export default async function seed() {
  const queryFirst = await Account.find({});
  if (queryFirst && queryFirst.length === 0) {
    console.log("--- Seeding Accounts...");
    await Account.insertMany(data);
    console.table(data, [
      "_id",
      "email",
      "password",
      "fname",
      "lname",
      "gender",
    ]);
    console.log(`${data.length} Accounts seeded successfully! \n\n`);
  } else {
    console.log("Account data exist, no seeding needed");
  }
}
