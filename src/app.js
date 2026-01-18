import express from "express";
import cors from "cors";
import authToken from "./middleware/authToken.js";
import isAdmin from "./middleware/isAdmin.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";
import adminRoutes from "./routes/admin.js";
import YAML from "yamljs";
import dotenv from "dotenv"; // keep import for environments that import app directly
import swaggerUi from "swagger-ui-express";
dotenv.config();

const swaggerDocument = YAML.load("./swagger.yaml");

// swagger URL uses process.env.PORT at runtime; server entrypoint should set PORT before
// importing this module in non-test runs.
if (
  swaggerDocument &&
  Array.isArray(swaggerDocument.servers) &&
  swaggerDocument.servers[0]
) {
  swaggerDocument.servers[0].url = `http://localhost:${
    process.env.PORT || 3000
  }`;
}

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// The server entrypoint (`src/server.js`) is responsible for connecting to MongoDB and
// starting the HTTP server. Export the Express `app` for tests.

// Export the app for use in tests and the server entrypoint.
app.use("/auth", authRoutes);
app.use("/task", authToken, isAdmin, taskRoutes);
app.use("/admin", authToken, isAdmin, adminRoutes);

export default app;
