import { Router } from "express";
import { aiAgent } from "../services/agent.js";

const router = Router();

router.post("/chat", (req, res) => {
  try {
    const { message, history, language } = req.body;

    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Message is too long",
      });
    }

    const safeHistory = Array.isArray(history) ? history.slice(-10) : [];

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const result = aiAgent(message, safeHistory, language);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

export default router;
