import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import doctorLicenseRoutes from "./routes/doctorLicenseRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorMiddleware.js";

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];

const corsOptions = {
  origin: (requestOrigin, callback) => {
    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(" DR Screening Backend Running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RatinoCare API is healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/doctor-licenses", doctorLicenseRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
