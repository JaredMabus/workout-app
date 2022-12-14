import { Router } from "express";
import {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  authenticateLogin,
  getLoggedInAccountData,
} from "../../controllers/account-controller";
import cookieAuth from "../middleware/cookieAuth";
import s3ServiceMW from "../middleware/s3-service";

const router = Router();

// Account CRUD routes
router.route("/data").get(cookieAuth, getLoggedInAccountData);
router
  .route("/:id")
  .get(cookieAuth, getAccountById)
  .delete(cookieAuth, deleteAccount);
router
  .route("/")
  .get(cookieAuth, getAllAccounts)
  .put([cookieAuth], updateAccount)
  .post(createAccount);

// Auth routes
router.route("/login").post(authenticateLogin);
router.post("/logout", cookieAuth, (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ msg: "Logged out" });
  } catch (err) {
    res.status(500).json({ error: true, msg: "Could not logout" });
  }
});

export default router;
