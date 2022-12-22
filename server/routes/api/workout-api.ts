import { Router } from "express";
import {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getLoggedInWorkoutData,
} from "../../controllers/workout-controller";
const router = Router();

// Workout CRUD routes
router.route("/data").get(getLoggedInWorkoutData);
router.route("/:id").get(getWorkoutById);
router
  .route("/")
  .get(getAllWorkouts)
  .put(updateWorkout)
  .post(createWorkout)
  .delete(deleteWorkout);

export default router;
