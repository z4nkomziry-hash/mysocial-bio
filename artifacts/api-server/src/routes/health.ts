import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  // بۆ لادانا کێشەیا دۆزینەوەیا جۆری (Type Check) و پاراستنا هەمان شێوازێ کارکرنێ
  const data = { status: "ok" as const };
  res.json(data);
});

export default router;
