import { Router } from "express";
import registerController from "../controllers/register.controllers";

const router: Router = Router();

router.post("/", registerController);

export default router;
