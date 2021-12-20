import React from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import neiist from '../images/neiist_banner.jpg';

const ArticlePage = () => (
  <>
    <ArticleView />
  </>
);

const ArticleView = () => (
  <>
    <div style={{ margin: '2rem 20vw 1rem 20vw' }}>
      <h1 style={{ textAlign: 'center' }}>TITULO DO ARTIGO</h1>
      <p>
        Article description
      </p>
      <Image src={neiist} fluid />
      <p>
        Render markdown of the article here
      </p>

      <div className="d-grid gap-2">
        <Button
          variant="primary"
          type="submit"
          onClick={() => {
            //  go to create page
          }}
        >
          Editar
        </Button>
        {' '}

        <Button
          variant="danger"
          type="submit"
          onClick={() => {
            //   delete check
          }}
        >
          Apagar
        </Button>
      </div>
    </div>
  </>
);

export default ArticlePage;
