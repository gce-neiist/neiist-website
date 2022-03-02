const db = require('./database');

const createArticles = async () => {
  try {
    await db.query(
      `CREATE TABLE articles(
                id serial PRIMARY KEY,
                title varchar(100),
                "date" date,
                description text,
                body text

            )`,
    );
  } catch (err) {
    if (err.code === '42P07') ; // table already exists
    else { console.error(err); }
  }
};

const createArticle = async (article) => {
  try {
    await db.query('INSERT INTO articles(title, "date", description, body) VALUES($1, $2, $3, $4)', [article.title, article.date, article.description, article.body]);
  } catch (err) {
    console.error(err);
  }
};


const getArticles = async () => {
    let articles;
    try {
      const articlesResult = await db.query('SELECT * FROM articles');
      articles = articlesResult.rows;
    } catch (err) {
      console.error(err.message);
    }
    return articles;
  };

const getArticle = async (articleId) => {
    let article;
    try {
      const articleResult = await db.query('SELECT * FROM articles WHERE id =$1', [articleId]);
      article = articleResult.rows;
    } catch (err) {
      console.error(err.message);
    }
    return article;
  };

const updateArticle = async (articleId, article) => {
    try{
        await db.query('UPDATE articles SET title = $1, "date" = $2, description = $3, body = $4 WHERE id = $5', [artcile.title, article.date, article.description, article.body, articleId])
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
  createArticles,
  createArticle,
  getArticles,
  getArticle,
  updateArticle
};
