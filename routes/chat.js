// routes/chat.js

const express = require("express");
const router = express.Router();

const OpenAI = require("openai");

// ✅ Groq uses OpenAI-compatible SDK
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/", async (req, res) => {
  try {
    const { message, location, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const city = location?.city || "Jaipur";

    // Optional past chat history
    const chatHistory = history.map((item) => ({
      role: item.role === "you" ? "user" : "assistant",
      content: item.text,
    }));

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ Fast + great for hackathon
      temperature: 0.7,
      max_tokens: 350,

      messages: [
        {
          role: "system",
          content: `
You are Gaia, EcoSense AI assistant.

Your job:
- Help users with environment, AQI, weather, water, waste, sustainability.
- Explain in simple language.
- Use analogies when useful.
- Keep answers short, 
smart, practical.
- Friendly modern tone.
- If asked random question, still answer helpfully.
- Mention city context when relevant.

Current city: ${city}
          `,
        },

        ...chatHistory,

        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.json({
      reply,
    });
  } catch (error) {
    console.error("Gaia Error:", error);

    res.status(500).json({
      error: "Failed to get Gaia response",
    });
  }
});

module.exports = router;