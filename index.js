const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/message', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // change to your frontend domain if needed
          "X-Title": "ChatBot App"
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.send({ message: reply });
  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    res.status(500).send({ message: "Failed to fetch response from OpenRouter." });
  }
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
