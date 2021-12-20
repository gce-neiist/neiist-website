import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import neiist from '../images/neiist_banner.jpg';

const ArticleListPage = () => (
  <>
    <ListArticlesView />
  </>
);

const ListArticlesView = () => (
  <>
    <div style={{ margin: '2rem 10vw 1rem 10vw' }}>
      <h1 style={{ textAlign: 'center' }}>ARTIGOS</h1>
      <Row xs={1} md={3} className="g-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Col>
            <Card style={{ width: '20rem' }}>
              <Card.Img variant="top" src={neiist} />
              <Card.Body>
                <Card.Title>Article title</Card.Title>
                <Card.Text>
                    Description of the article
          </Card.Text>
                <Card.Link href="#">Read more</Card.Link>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">insert date here</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  </>
);

export default ArticleListPage;
