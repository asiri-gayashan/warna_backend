import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mainrouter from "./src/routes/index.js";
import authRoutes from "./src/modules/auth/auth.routes.js";
import { connectDB, disconnectDB } from "./src/config/db.js";
import { Server } from "node:http";
import classRoutes from "./src/modules/classes/classes.routes.js";

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/users", mainrouter);
app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);




const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  Server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("unhandledException", async (err) => {
  console.error("Unhandled Exception:", err);
  await disconnectDB();
  process.exit(1);
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  Server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
