import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import db from "./config/connection";
import apiRoutes from "./routes/api";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("tiny"));
}

app.use("/api", apiRoutes);

app.get("*", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  } catch (err) {
    res.status(500);
    throw new Error("could not send index.html");
  }
});

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    if (res.statusCode < 400) res.status(500);
    return res.json({ err: true, msg: err.message });
  } catch (err) {
    res.status(500);
    res.json({ err: true, msg: "Interal Server Error" });
  }
});

db.once("open", () => {
  try {
    app.listen(port, () => {
      console.log(`Listening at -- http://localhost:${port} -- 🚀`);
    });
  } catch (err) {
    console.log(err);
  }
});
