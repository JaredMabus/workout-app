import { Round } from "../models";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { endOfToday, startOfToday } from "date-fns";
dotenv.config();

export const createRound = async (req: Request, res: Response) => {
  try {
    const createQuery = await Round.create(req.body);

    await createQuery.populate({
      path: "workoutId",
      select: { _id: 1, name: 1 },
    });

    if (!createQuery)
      return res
        .status(500)
        .json({ error: true, msg: "Could not create round" });
    return res.status(200).json({ msg: "success", payload: createQuery });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Counld to create round" });
  }
};

export const todaysFinishedRounds = async (req: Request, res: Response) => {
  try {
    const todaysFinishedRounds = await Round.find(
      {
        accountId: res.locals.cookie.accountData._id,
        date: {
          $gte: startOfToday(),
          $lte: endOfToday(),
        },
      },
      { _id: 1, workoutId: 1, sets: 1, date: 1 }
    ).populate({
      path: "workoutId",
      select: { _id: 1, name: 1 },
    });

    if (todaysFinishedRounds)
      return res
        .status(200)
        .json({ msg: "success", payload: todaysFinishedRounds });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: true, msg: "Counld not retrieve todays rounds" });
  }
};

export const getAllRounds = async (req: Request, res: Response) => {
  try {
    const getAllQuery = await Round.find({});

    res.status(200).json({ payload: getAllQuery });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

export const getRoundById = async (req: Request, res: Response) => {
  try {
    const getByIdQuery = await Round.findById(req.params.id);

    if (!getByIdQuery)
      return res
        .status(404)
        .json({ error: true, msg: "No Round found by that id" });

    return res.status(200).json({ payload: getByIdQuery });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: true, msg: "No Round found by that id" });
  }
};

export const getLoggedInRoundData = async (req: Request, res: Response) => {
  try {
    const getByIdQuery = await Round.find({
      accountId: res.locals.cookie.accountData._id,
    });

    if (!getByIdQuery)
      return res
        .status(400)
        .json({ error: true, msg: "No Round found by that id" });

    return res.status(200).json({ payload: getByIdQuery });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: true, msg: "Could not search database " });
  }
};

export const updateRound = async (req: Request, res: Response) => {
  try {
    const updatedRound = await Round.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    if (!updatedRound)
      return res.status(404).json({ error: true, msg: "No Round found" });
    res.status(200).json({ payload: updatedRound });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Round could not be updated" });
  }
};

export const deleteRound = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (Array.isArray(data)) {
      const deleteQuery = await Round.deleteMany({
        _id: { $in: data },
      });
      if (!deleteQuery)
        return res
          .status(404)
          .json({ error: true, msg: "Could not delete rounds" });

      res
        .status(200)
        .json({ msg: "Rounds successfully deleted", payload: data });
    } else {
      const deleteQuery = await Round.findByIdAndDelete(req.params.id);
      if (!deleteQuery)
        return res.status(404).json({ error: true, msg: "No Round found" });

      res.status(200).json({ msg: "Round successfully deleted" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Round could not be deleted" });
  }
};
