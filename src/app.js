import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authToken from "./middleware/authToken.js";
import isAdmin from "./middleware/isAdmin.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";
import adminRoutes from "./routes/admin.js";
import dotenv from "dotenv";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const swaggerDocument = YAML.load("./swagger.yaml");

const PORT = process.env.PORT || 5000;
if (
  swaggerDocument &&
  Array.isArray(swaggerDocument.servers) &&
  swaggerDocument.servers[0]
) {
  swaggerDocument.servers[0].url = `http://localhost:${PORT}`;
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

const MONGO_DB_URL = process.env.MONGO_DB_URL;
if (!MONGO_DB_URL) {
  console.error(
    "Missing required environment variable MONGO_DB_URL. Set it in your .env or environment."
  );
  process.exit(1);
}

// Connect to MongoDB first, then start the HTTP server.
(async () => {
  try {
    await mongoose.connect(MONGO_DB_URL, {
      // keep backward-compatible options; mongoose will ignore unknown ones in newer versions
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
})();

app.use("/auth", authRoutes);
app.use("/task", authToken, isAdmin, taskRoutes);
app.use("/admin", authToken, isAdmin, adminRoutes);
