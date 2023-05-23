import { Router } from "express";
import ROLES_LIST from "../config/rolesList";
import verifyRoles from "../middlewares/verifyRoles";
import {
  getAllUsers,
  deleteUser,
  getUser,
} from "../controllers/users.controllers";

const router: Router = Router();

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Admin), getAllUsers)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteUser);

router.route("/:id").get(verifyRoles(ROLES_LIST.Admin), getUser);

export default router;
