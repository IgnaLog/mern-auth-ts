import { Router } from "express";
import refreshTokenController from "../controllers/refreshToken.controllers";

const router: Router = Router();

router.get("/", refreshTokenController);

export default router;
