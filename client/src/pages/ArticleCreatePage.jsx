import axios from 'axios';
import React, { useState } from 'react';
import {
  Button, Form, Tabs, Tab, Container,
} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

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
        <Form onSubmit={async () => {
          const article = {
            title,
            date: new Date(),
            description,
            body: markdown,
          };
          console.log(article);
          await axios.post('/api/articles', article);
        }}
        >
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
            <Form.Control type="file" />
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

          <Tabs defaultActiveKey="markdown" id="markdown-preview-tabs" className="mb-3">
            <Tab eventKey="markdown" title="Markdown">
              <Form.Group className="mb-3">
                <Form.Control
                  required
                  as="textarea"
                  rows={20}
                  value={markdown}
                  onChange={(event) => setMarkdown(event.target.value)}
                />
              </Form.Group>
            </Tab>
            <Tab eventKey="preview" title="Preview">
              <Container>
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </Container>
            </Tab>
          </Tabs>

          <Button
            variant="primary"
            type="submit"
            // onClick={async () => {

            //   // await axios.post('api/articles', article);
            // }}
          >
            Publicar
          </Button>
          {' '}

          <Button variant="secondary" as={Link} to="/artigos">
            Cancelar
          </Button>
        </Form>
      </div>
    </>
  );
};

export default ArticleCreatePage;
