import React from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const AdminMenuPage = () => (
  <div style={{
    alignItems: 'center',
    margin: '2rem 20vw',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'space-around',
    flexWrap: 'wrap',
  }}
  >
    <Button as={Link} to="/admin/areas" style={{ margin: '0 10px' }}>
      Áreas
    </Button>
    <Button as={Link} to="/admin/theses" style={{ margin: '0 10px' }}>
      Teses
    </Button>
    <Button as={Link} to="/admin/elections" style={{ margin: '0 10px' }}>
      Eleições
    </Button>
    <Button as={Link} to="/admin/shop" style={{ margin: '0 10px' }}>
      Loja
    </Button>
  </div>
);

export default AdminMenuPage;
