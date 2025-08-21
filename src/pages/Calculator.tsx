import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Calculator: React.FC = () => {
  return (
    <div className="page">
      <Link to="/" className="back-button">
        ← Volver al Home
      </Link>
      
      <header className="header">
        <h1 className="title">Calculadora de Costos</h1>
      </header>
      
      <div className="description">
        <p>Aquí irá la calculadora para calcular costos de confección.</p>
        <p>Podrás calcular:</p>
        <ul style={{textAlign: 'left', marginTop: '1rem'}}>
          <li>Costo de materiales</li>
          <li>Tiempo de confección</li>
          <li>Precio de venta sugerido</li>
          <li>Margen de ganancia</li>
        </ul>
      </div>
    </div>
  );
};

export default Calculator;
