// controllers/newsletterController.js
import { success, error as apiError } from "../utils/ApiResponse.js";

import Subscriber from "../models/Subscriber.js";

export async function subscribe(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json(apiError("Email is required"));

    const existing = await Subscriber.findOne({ email });
    if (existing)
      return res.status(400).json(apiError("Email already subscribed"));

    const subscriber = await Subscriber.create({ email });

    res.status(201).json(success(subscriber, "Subscribed successfully"));
  } catch (err) {
    next(err);
  }
}
