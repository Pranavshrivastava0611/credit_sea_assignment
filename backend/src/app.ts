import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { errorHandler } from "./middleware/error.middleware";
import { env } from "./config/env";

// Import routes
import authRoutes from "./routes/auth.routes";
import borrowerRoutes from "./routes/borrower.routes";
import salesRoutes from "./routes/sales.routes";
import sanctionRoutes from "./routes/sanction.routes";
import disbursementRoutes from "./routes/disbursement.routes";
import collectionRoutes from "./routes/collection.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
app.use(morgan("dev"));

// Static files (uploaded salary slips)
app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/borrower", borrowerRoutes);
app.use("/api/v1/sales", salesRoutes);
app.use("/api/v1/sanction", sanctionRoutes);
app.use("/api/v1/disbursement", disbursementRoutes);
app.use("/api/v1/collection", collectionRoutes);
app.use("/api/v1/admin", adminRoutes);

// Health check
app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
