import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { CLIENT_URL, PORT } from "./config/index.ts";
import { connectToMongoDB } from "./config/db/index.ts";
import authRouter from "./routes/auth.route.ts";
import adminRouter from "./routes/admin.route.ts";
import { checkAuth } from "./middlewares/checkAuth.middleware.ts";
import lenderRouter from "./routes/lender.route.ts";
import portfolioRouter from "./routes/portfolio.route.ts";
import collectorRouter from "./routes/collector.route.ts";
import bidRouter from "./routes/bid.route.ts";
// import path from "path"
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const app = express();

// CORS configuration should be first
app.use(cors({
    origin: [
        "http://localhost:5173",
        // "http://192.168.1.100:5173",
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


// (function () {
//     console.log("Let's Gooooo Asad");
//     return Promise.resolve();
// })()
connectToMongoDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    });


app.get("/", (req, res) => {
    res.send("Hello World From Lender App!");
});

app.get("/aiyman", (req, res) => {
    res.status(200).json({ status: "success", message: `Hello from Lender App backend ${req.route.path.slice(1)}` });
});

// app.get("/file", (req, res) => {
//     const filePath = path.join(__dirname, "../public", "new-sample.csv");
//     res.download(filePath, "new-sample.csv", (err) => {
//         if (err) {
//             console.error("Download error:", err);
//             res.status(500).send("Error downloading file.");
//         }
//     });
// })


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/lender", lenderRouter);
app.use("/api/v1/collector", collectorRouter);
app.use("/api/v1/portfolio", portfolioRouter);
app.use("/api/v1/bids", bidRouter);


// app.use("/api/v1/admin", checkAuth("admin"), adminRouter);

export default app;
