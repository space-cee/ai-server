require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const model = "gemma-3-4b-it";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: userMessage }] }]
      },
      {
        timeout: 8000 
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.setHeader("Content-Type", "application/json");
    res.json({
      reply: reply.slice(0, 4000)
    });

  } catch (err) {
    console.error("CHAT ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.get('/test', async (req, res) => {
  const message = req.query.message || "Say hello";

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: message }] }]
      },
      {
        timeout: 8000
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.setHeader("Content-Type", "application/json");
    res.json({
      reply: reply.slice(0, 4000)
    });

  } catch (err) {
    console.error("TEST ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Test request failed" });
  }
});

app.listen(port, () => {
  console.log(`AI server running on port ${port}`);
});
