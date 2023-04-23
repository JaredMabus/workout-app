import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import db from "./config/connection";
import apiRoutes from "./routes/api";
import multer, { Multer } from "multer";
import compression from "compression";

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT as string) || 3001;
const host: string =
  process.env.NODE_ENV === "production" ? "0.0.0.0" : "0.0.0.0";
const upload = multer();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./build")));
  app.use(morgan("tiny"));
} else {
  app.use(express.static(path.resolve(__dirname, "./build")));
  app.use(morgan("tiny"));
}

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      "http://3.12.238.39",
      "http://ec2-3-12-238-39.us-east-2.compute.amazonaws.com",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array("files"));
app.use(compression());

app.use("/api", apiRoutes);

app.get("*", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.sendFile(path.join(__dirname, "./build/index.html"));
  } catch (err) {
    res.status(500);
    next(err);
  }
});

// Error Handler
app.use(
  async (err: Error | any, req: Request, res: Response, next: NextFunction) => {
    try {
      if (res.statusCode < 400) res.status(500);
      if (err.code) {
        switch (err.code) {
          case 11000:
            return res
              .status(405)
              .json({ err: true, msg: "Account already exist" });
        }
      }
      console.log(err);
      return res.json({ err: true, msg: err.message });
    } catch (err) {
      return res.status(500).json({ err: true, msg: "Interal Server Error" });
    }
  }
);

db.once("open", () => {
  try {
    app.listen(port, host, () => {
      console.log(`Listening at -- ${host}:${port} -- 🚀`);
    });
  } catch (err) {
    console.log(err);
  }
});
