const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

router.get('/headlines', async (req, res, next) => {
  try {
    const { country, category } = req.query;
    const data = await newsService.getHeadlines(country, category);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { query } = req.query;
    const data = await newsService.searchNews(query);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
