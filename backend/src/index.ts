import app from "./app";
import connectDB from "./config/db";
import { env } from "./config/env";

const PORT = parseInt(env.PORT) || 8000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n🚀 LMS Backend running on http://localhost:${PORT}`);
      console.log(`📚 API Base: http://localhost:${PORT}/api/v1`);
      console.log(`🏥 Health:   http://localhost:${PORT}/api/v1/health\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
