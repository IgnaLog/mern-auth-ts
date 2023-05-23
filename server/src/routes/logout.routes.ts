import { Router } from "express";
import logoutController from "../controllers/logout.controllers";

const router: Router = Router();

router.get("/", logoutController);

export default router;
