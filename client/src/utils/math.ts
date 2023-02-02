import {
  GoalType,
  WorkoutType,
  RecentRound,
  RoundType,
} from "../Redux/slices/workoutSlice";
import { ProgressObjType } from "../pages/Workout/components/ProgressChart";

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

// Return percent of rounds that meet current goal
export const workoutGoalAchieved = (
  workout: WorkoutType,
  lastRound: Partial<RecentRound> | null,
  goal: GoalType
): ProgressObjType => {
  var progressObj: ProgressObjType = {
    targetRounds:
      goal != null && goal.targetRounds != null ? goal.targetRounds : 6,
    totalRounds:
      lastRound != null && lastRound.rounds != null
        ? lastRound.rounds.length
        : 0,
    totalSucessRounds: 0,
    progressPercent: 0,
  };

  try {
    const { targetSets, targetWeight, targetReps } = goal;

    if (lastRound != null && lastRound.rounds != null) {
      lastRound.rounds.forEach((round) => {
        if (targetSets != null && targetWeight != null && targetReps != null) {
          var successfulSets: boolean[] = [];

          round.sets.forEach((set) => {
            if (set.weight >= targetWeight && set.reps >= targetReps) {
              successfulSets.push(true);
            }
          });
          if (successfulSets.length >= targetSets) {
            progressObj.totalSucessRounds++;
          }
        }
      });
    }

    if (progressObj.totalSucessRounds > progressObj.targetRounds) {
      progressObj.totalSucessRounds = progressObj.targetRounds;
    }

    progressObj.progressPercent =
      (progressObj.totalSucessRounds / progressObj.targetRounds) * 100;
  } catch (err) {
    console.log(err);
  }
  return progressObj;
};
