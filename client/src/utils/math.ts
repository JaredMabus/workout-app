import {
  GoalType,
  WorkoutType,
  GoalByMethod,
  RecentRound,
  RoundType,
} from "../Redux/slices/workoutSlice";

// Brzycki Equation for estimating 1RM and lifting percentages
// 1RM = w / [(1.0278) – (0.0278 * r)]
const calcLiftPercent = (weight: number, reps: number) => {
  let oneRM = weight / (1.0278 - 0.0278 * reps);
  let liftPercent = weight / oneRM;

  var intensityTable = [];
  var maxPercent = 1;

  for (let i = 0; i < 10; i++) {
    let newWeight = oneRM * maxPercent;
    let obj = {
      percent: {
        title: "Percent of 1RM",
        value: Math.round(maxPercent * 100),
      },
      weight: {
        title: "Weight",
        value: Math.round(newWeight),
      },
      reps: {
        title: "Reps",
        value: Math.round(-((35.97122302 * newWeight) / oneRM) + 36.97122302),
      },
    };
    maxPercent = maxPercent - 0.05;
    intensityTable.push(obj);
  }
  // console.log(intensityTable)
  return liftPercent;
};

interface WorkoutGoalAchievedObj {
  totalSucessRounds: number;
  roundTarget: number;
  progressPercent: number;
}

// Return percent of rounds that meet current goal
export const workoutGoalAchieved = (
  workout: WorkoutType,
  roundData: Partial<RecentRound> | null,
  goal: GoalByMethod
): WorkoutGoalAchievedObj => {
  var progressObj: WorkoutGoalAchievedObj = {
    totalSucessRounds: 0,
    roundTarget: 0,
    progressPercent: 0,
  };
  try {
    console.log(roundData);
    if (roundData != null && roundData.rounds != null) {
      // Test if all round's weight, sets, and reps are equal
      let totalSuccessRounds = 0;

      // for(let round = 0; round < workout.targetGoal.roundGoal, round++){
      //   const { targetWeight, targetSets, targetReps } = goal.values[0];
      //   if (
      //     round.weight === targetWeight &&
      //     round.sets === targetSets &&
      //     round.reps === targetReps &&
      //     round.successSetsReps === true
      //   ) {
      //     totalSuccessRounds++;
      //   }
      // }
      let lastGoalRoundRange = roundData.rounds.slice(
        0,
        workout.targetGoal.roundGoal
      );
      lastGoalRoundRange.forEach((round) => {
        const { targetWeight, targetSets, targetReps } = goal.values[0];
        if (targetWeight != null && targetSets != null && targetReps != null) {
          if (
            round.successSetsReps === true &&
            round.weight >= targetWeight &&
            round.sets >= targetSets &&
            round.reps >= targetReps
          ) {
            totalSuccessRounds++;
          } else if (
            round.successSetsReps === false &&
            round.weight >= targetWeight &&
            round.sets >= targetSets &&
            targetReps - round.reps <= 1
          ) {
            totalSuccessRounds++;
          }
        }
      });

      let percentWeightEqual: number =
        totalSuccessRounds / workout.targetGoal.roundGoal;
      console.log(percentWeightEqual);

      if (typeof percentWeightEqual === "number") {
        console.log("Is number");
        progressObj.totalSucessRounds = totalSuccessRounds;
        progressObj.roundTarget = workout.targetGoal.roundGoal;
        progressObj.progressPercent = percentWeightEqual * 100;

        return progressObj;
      } else {
        return progressObj;
      }
    } else {
      return progressObj;
    }
  } catch (err) {
    console.log(err);
    return progressObj;
  }
};
