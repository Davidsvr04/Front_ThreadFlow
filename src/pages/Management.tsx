import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Management: React.FC = () => {
  return (
    <div className="page">
      <Link to="/" className="back-button">
        ← Volver al Home
      </Link>
      
      <header className="header">
        <h1 className="title">Gestión de Confeccionistas</h1>
      </header>
      
      <div className="description">
        <p>Aquí irá la gestión del equipo de confeccionistas.</p>
        <p>Podrás administrar:</p>
        <ul style={{textAlign: 'left', marginTop: '1rem'}}>
          <li>Datos del personal</li>
          <li>Asignación de tareas</li>
          <li>Control de productividad</li>
          <li>Pagos y comisiones</li>
        </ul>
      </div>
    </div>
  );
};

export default Management;
