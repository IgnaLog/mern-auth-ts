import { Router } from "express";
import authController from "../controllers/auth.controllers";

const router: Router = Router();

router.post("/", authController);

export default router;
