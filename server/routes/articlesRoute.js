const express = require('express');
const { articlesService } = require('../services');

const router = express.Router();

router.use(express.json());

router.post('/', async (req) => {
  const article = req.body;
  await articlesService.newArticle(article);
});

router.get('/', async (req, res) => {
  const articles = await articlesService.getArticles();
  res.json(articles);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const article = await articlesService.getArticle(id);
    res.json(article);
});

module.exports = router;
