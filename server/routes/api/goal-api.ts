import { Router } from "express";
import {
  createGoal,
  getAllGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getLoggedInGoalData,
} from "../../controllers/goal-controller";
const router = Router();

// Goal CRUD routes
router.route("/data").get(getLoggedInGoalData);
router.route("/:id").get(getGoalById).delete(deleteGoal);
router.route("/").get(getAllGoals).put(updateGoal).post(createGoal);

export default router;
