import db from "../config/connection";
import seedAccount from "./account";
import seedWorkout from "./workout";
import seedRound from "./round";
import seedGoal from "./goal";
import * as model from "../models";
import dotenv from "dotenv";
dotenv.config();

db.once("open", async () => {
  try {
    if (process.env.MONGODB_URI) {
      throw new Error(
        "There is a MONGODB_URI environment variable. Cannot run seed files on production database."
      );
    }
    // Start timer. Displayed after seeding is complete
    console.time("seeding time:");

    await db.collections["accounts"].drop(function (err) {
      console.log("accounts dropped");
    });
    await db.collections["workouts"].drop(function (err) {
      console.log("workouts dropped");
    });
    await db.collections["rounds"].drop(function (err) {
      console.log("rounds dropped");
    });
    await db.collections["goals"].drop(function (err) {
      console.log("goals dropped");
    });

    // Delete data from collections
    // await model.Account.deleteMany({});
    // await model.Workout.deleteMany({});
    // await model.Round.deleteMany({});

    // Run seed functions
    await seedAccount();
    await seedWorkout();
    await seedRound();
    await seedGoal();

    console.log(`Successfully seeded database!`);
  } catch (err) {
    console.log(err);
  } finally {
    console.timeEnd("seeding time:");
    process.exit(0);
  }
});
