const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

router.get('/current', async (req, res, next) => {
  try {
    const { city } = req.query;
    const data = await weatherService.getCurrentWeather(city);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/forecast', async (req, res, next) => {
  try {
    const { city, days } = req.query;
    const data = await weatherService.getForecast(city, days);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
