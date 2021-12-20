import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ArticleCreatePage = () => (
  <>
    <CreateArticleView />
  </>
);

const CreateArticleView = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [markdown, setMarkdown] = useState('');

  return (
    <>
      <div style={{ margin: '2rem 20vw 1rem 20vw' }}>
        <h1 style={{ textAlign: 'center' }}>NOVO ARTIGO</h1>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              required
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Imagem de capa</Form.Label>
            <Form.Control required type="file" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Markdown</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={20}
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            onClick={() => {
              //   publish the article
            }}
          >
            Publicar
          </Button>
          {' '}

          <Button
            variant="secondary"
            type="submit"
            onClick={() => {
              //   go back to the articles page
            }}
          >
            Cancelar
          </Button>
        </Form>
      </div>
    </>
  );
};

export default ArticleCreatePage;
