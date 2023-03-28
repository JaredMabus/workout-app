import { Router } from "express";
import {
  createRound,
  getAllRounds,
  getRoundById,
  updateRound,
  deleteRound,
  getLoggedInRoundData,
  todaysFinishedRounds,
} from "../../controllers/round-controller";
const router = Router();

// Round CRUD routes
router.route("/data").get(getLoggedInRoundData);
router.route("/today").get(todaysFinishedRounds);
router.route("/:id").get(getRoundById);
router
  .route("/")
  .get(getAllRounds)
  .put(updateRound)
  .post(createRound)
  .delete(deleteRound);

export default router;
