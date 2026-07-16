import express, { type Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "./routes";
import { logger } from "./lib/logger";

// Determine allowed origin from env (works in both dev and production proxy)
const allowedOrigin = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : undefined;

const app: Express = express();

// مێدلوێرەکێ سادە و بێ کێشە بۆ لۆگکرنا داواکاریان د جهێ pino-http دا
// هەمان کار و زانیاری یێن داواکاریێ لۆگ دکەت بێی تێکدانا سیستەمێ ESM
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    
    // کورتکرنا لینکێ داواکاریێ (لادانا پرسیار دۆشەکێ/Query params) هەروەک کۆدێ تە یێ کۆن
    const cleanUrl = typeof req.url === "string" ? req.url.split("?")[0] : undefined;

    logger.info({
      req: {
        method: req.method,
        url: cleanUrl,
      },
      res: {
        statusCode: res.statusCode,
      },
      duration: `${duration}ms`
    }, `Request processed`);
  });
  next();
});

app.use(cors({
  origin: allowedOrigin ?? true, // reflect origin in dev when domain unknown
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Global JSON error handler — must be last middleware
// Without this Express sends HTML error pages instead of JSON
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err, url: req.url, method: req.method }, "Unhandled error");
  res.status(500).json({ error: "خەتایەکی ناخۆش ڕوویدا" });
});

export default app;
