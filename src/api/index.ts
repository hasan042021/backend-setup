import { Router } from "express";
import V1Routes from "@api/v1/index";

const router = Router();

router.use("/v1", V1Routes); // Internal API (v1)

export default router;
