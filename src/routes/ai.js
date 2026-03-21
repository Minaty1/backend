const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

router.post('/chat', async (req, res, next) => {
  try {
    const { message, userId } = req.body;
    const response = await aiService.chat(message, userId);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/image', async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const data = await aiService.generateImage(prompt);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/tts', async (req, res, next) => {
  try {
    const { text } = req.body;
    const data = await aiService.textToSpeech(text);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
