import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import pagesRouter from "./pages";
import blocksRouter from "./blocks";
import linksRouter from "./links";
import analyticsRouter from "./analytics";
import publicRouter from "./public";
import redirectRouter from "./redirect";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(pagesRouter);
router.use(blocksRouter);
router.use(linksRouter);
router.use(analyticsRouter);
router.use(publicRouter);
router.use(redirectRouter);
router.use(uploadRouter);

export default router;
