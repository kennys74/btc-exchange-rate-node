import express from "express";

import UserRequest from "../models/userRequest.js";

const router = express.Router();

export const createRequestResponse = async (data) => {
  const { exchangeRateRequest, exchangeRateResponse } = data;

  const newUserRequest = new UserRequest({
    exchangeRateRequest: exchangeRateRequest,
    exchangeRateResponse: exchangeRateResponse,
  });

  try {
    await newUserRequest.save();

    res.status(201).json(newUserRequest);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const viewRequestsResponses = async (req, res) => {
  try {
    const allUserRequests = await UserRequest.find();

    console.log(allUserRequests);
    res.status(200).json(allUserRequests);
  } catch (error) {
    console.log(error.message);
  }
};
