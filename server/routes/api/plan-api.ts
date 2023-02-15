import { Router } from "express";
import {
  getWorkoutPlanWeek,
  updatePlan,
  addWorkoutToPlan,
  deletePlan,
} from "../../controllers/plan-controller";
const router = Router();

// Plan CRUD routes
router
  .route("/")
  .get(getWorkoutPlanWeek)
  .post(addWorkoutToPlan)
  .put(updatePlan)
  .delete(deletePlan);

export default router;
