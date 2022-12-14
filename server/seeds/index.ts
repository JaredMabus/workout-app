import db from "../config/connection";
import seedAccount from "./account";
import seedWorkout from "./workout";
import seedRound from "./round";
import * as model from "../models";

db.once("open", async () => {
  try {
    // Start timer. Displayed after seeding is complete
    console.time("seeding time:");
    console.log("test");
    // Delete data from databases
    // await model.Account.deleteMany({});
    // await model.Workout.deleteMany({});
    // await model.Round.deleteMany({});

    // Run seed functions
    await seedAccount();
    await seedWorkout();
    await seedRound();

    console.log(`Successfully seeded database!`);
  } catch (err) {
    console.log(err);
  } finally {
    console.timeEnd("seeding time:");
    process.exit(0);
  }
});
