import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Inventory from './pages/Inventory';
import Management from './pages/Management';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/management" element={<Management />} />
      </Routes>
    </Router>
  );
}

export default App;
