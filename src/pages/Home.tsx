import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  return (
    <div className="home">
      <header className="header">
        <h1 className="title">ThreadFlow</h1>
      </header>

      <div className="buttons-container">
        <Link to="/calculator" className="feature-button">
          <div className="feature-icon">🧮</div>
          <div className="feature-title">Calculadora</div>
        </Link>

        <Link to="/inventory" className="feature-button">
          <div className="feature-icon">📦</div>
          <div className="feature-title">Inventario</div>
        </Link>

        <Link to="/management" className="feature-button">
          <div className="feature-icon">👥</div>
          <div className="feature-title">Gestión de Confeccionistas</div>
        </Link>
      </div>

      <div className="description">
        <h2>Explicaciones de la aplicación</h2>
        <p>
          ThreadFlow es una aplicación integral para la gestión de talleres de confección. 
          Con esta herramienta podrás calcular costos de producción, gestionar tu inventario 
          de materiales y administrar tu equipo de confeccionistas de manera eficiente. 
          Optimiza tus procesos y lleva el control total de tu negocio textil.
        </p>
      </div>

      <footer className="footer">
        <div className="developer-info">
          Desarrollado por Davidsvr04
        </div>
      </footer>
    </div>
  );
};

export default Home;
