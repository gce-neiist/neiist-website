const { articlesDatabase } = require('../database');

const newArticle = async (article) => {
    console.log(article)
  await articlesDatabase.createArticle(article);
};

const getArticles = async () => {
  const articles = await articlesDatabase.getArticles();
  return articles;
};

const getArticle = async (id) => {
  const article = await articlesDatabase.getArticle(id);
  return article;
};

module.exports = {
  newArticle,
  getArticles,
  getArticle,
};
