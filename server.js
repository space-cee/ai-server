require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const model = "gemma-3-4b-it";

const app = express();
const port = process.env.PORT || 3000; // Use Replit's assigned port

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: "No message provided" });

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: [
          { parts: [{ text: userMessage }] }
        ]
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.[0]?.text ||
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});



app.listen(port, () => {
  console.log(`AI server running on port ${port}`);
});
app.get("/test", async (req, res) => {
  const message = req.query.message || "Say hello";
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      { contents: [{ parts: [{ text: message }] }] }
    );
    const reply = response.data.candidates?.[0]?.content?.[0]?.text ||
                  response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
                  "No response";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || "Failed" });
  }
});
