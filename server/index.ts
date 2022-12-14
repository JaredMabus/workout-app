import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import db from "./config/connection";
import apiRoutes from "./routes/api";
import multer, { Multer } from "multer";
import compression from "compression";
// import AWS from "aws-sdk";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const upload = multer();
// const s3 = new AWS.S3({ apiVersion: "2006-06-01" });

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array("files"));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("tiny"));
}
app.use(compression());

app.use("/api", apiRoutes);

app.get("*", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
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
    app.listen(port, () => {
      console.log(`Listening at -- http://localhost:${port} -- 🚀`);
    });
  } catch (err) {
    console.log(err);
  }
});
