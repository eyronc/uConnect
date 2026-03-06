import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

let conversation = [
  {
    role: "system",
    content: "You are a helpful AI assistant."
  }
];

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    conversation.push({
      role: "user",
      content: message
    });

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: conversation
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiMessage = response.data.choices[0].message;

    conversation.push(aiMessage);

    res.json({ reply: aiMessage.content });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

console.log("API KEY:", process.env.OPENROUTER_API_KEY);
