import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { CLIENT_URL } from "./config/index.js";
import authRouter from "./routes/auth.route.js";
import lenderRouter from "./routes/lender.route.js";
import portfolioRouter from "./routes/portfolio.route.js";
import collectorRouter from "./routes/collector.route.js";
import bidRouter from "./routes/bid.route.js";

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        "http://localhost:5173",
        CLIENT_URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

// Other middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/lender", lenderRouter);
app.use("/api/v1/collector", collectorRouter);
app.use("/api/v1/portfolio", portfolioRouter);
app.use("/api/v1/bids", bidRouter);

// Test routes
app.get("/", (req, res) => {
    res.send("Hello World From Lender App!");
});

app.get("/aiyman", (req, res) => {
    res.status(200).json({ status: "success", message: `Hello from Lender App backend ${req.route.path.slice(1)}` });
});

export default app;
