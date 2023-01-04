import { Round } from "../models";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const createRound = async (req: Request, res: Response) => {
  try {
    const createQuery = await Round.create(req.body);
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
    const getByIdQuery = await Round.find({ accountId: res.locals.cookie._id });

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
    const deleteQuery = await Round.findByIdAndDelete(req.params.id);
    if (!deleteQuery)
      return res.status(404).json({ error: true, msg: "No Round found" });

    res.status(200).json({ msg: "Round successfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, msg: "Round could not be deleted" });
  }
};
