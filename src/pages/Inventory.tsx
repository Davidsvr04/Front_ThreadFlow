import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Inventory: React.FC = () => {
  return (
    <div className="page">
      <Link to="/" className="back-button">
        ← Volver al Home
      </Link>
      
      <header className="header">
        <h1 className="title">Inventario</h1>
      </header>
      
      <div className="description">
        <p>Aquí irá la gestión del inventario de materiales.</p>
        <p>Podrás gestionar:</p>
        <ul style={{textAlign: 'left', marginTop: '1rem'}}>
          <li>Stock de telas y materiales</li>
          <li>Proveedores</li>
          <li>Entradas y salidas</li>
          <li>Alertas de stock mínimo</li>
        </ul>
      </div>
    </div>
  );
};

export default Inventory;
