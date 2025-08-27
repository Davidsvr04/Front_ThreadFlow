import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/calculator.css';

interface ProductItem {
  id: string;
  codigo: string;
  producto: string;
  talla: string;
  color: string;
  colorSesgo: string;
  cantidad: string | number;
  observaciones: string;
  valorUnitario: string | number;
  valorRestar: string | number;
  valorTotal: number;
}

interface SupplyDetail {
  codigo: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  producto: string;
}

interface SupplyGeneral {
  codigo: string;
  descripcion: string;
  cantidadTotal: number;
  unidad: string;
}

const Calculator: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [confeccionista, setConfeccionista] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: 'Colombia',
    fechaInicio: '',
    plazoEntrega: '',
    fechaMaxEntrega: ''
  });

  const [productos, setProductos] = useState<ProductItem[]>([
    {
      id: '1',
      codigo: '',
      producto: '',
      talla: '',
      color: '',
      colorSesgo: '',
      cantidad: '',
      observaciones: '',
      valorUnitario: '',
      valorRestar: '',
      valorTotal: 0
    }
  ]);

  const [insumosDetallados] = useState<SupplyDetail[]>([]);
  const [insumosGenerales] = useState<SupplyGeneral[]>([]);

  // Generar número de orden automático
  useEffect(() => {
    const generateOrderNumber = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `ORD-${year}${month}${day}-${random}`;
    };
    
    setOrderNumber(generateOrderNumber());
  }, []);

  // Calcular fecha máxima de entrega
  useEffect(() => {
    if (confeccionista.fechaInicio && confeccionista.plazoEntrega) {
      const fechaInicio = new Date(confeccionista.fechaInicio);
      const diasPlazo = parseInt(confeccionista.plazoEntrega);
      const fechaMax = new Date(fechaInicio);
      fechaMax.setDate(fechaMax.getDate() + diasPlazo);
      
      setConfeccionista(prev => ({
        ...prev,
        fechaMaxEntrega: fechaMax.toISOString().split('T')[0]
      }));
    }
  }, [confeccionista.fechaInicio, confeccionista.plazoEntrega]);

  const handleConfeccionistaChange = (field: string, value: string) => {
    setConfeccionista(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductoChange = (id: string, field: string, value: string | number) => {
    setProductos(prev => prev.map(producto => {
      if (producto.id === id) {
        const updated = { ...producto, [field]: value };
        
        // Calcular valor total automáticamente
        if (field === 'cantidad' || field === 'valorUnitario' || field === 'valorRestar') {
          const cantidad = typeof updated.cantidad === 'string' ? 
            (updated.cantidad === '' ? 0 : parseInt(updated.cantidad)) : 
            updated.cantidad;
          const valorUnitario = typeof updated.valorUnitario === 'string' ? 
            (updated.valorUnitario === '' ? 0 : parseFloat(updated.valorUnitario)) : 
            updated.valorUnitario;
          const valorRestar = typeof updated.valorRestar === 'string' ? 
            (updated.valorRestar === '' ? 0 : parseFloat(updated.valorRestar)) : 
            updated.valorRestar;
          
          updated.valorTotal = (cantidad * valorUnitario) - valorRestar;
        }
        
        return updated;
      }
      return producto;
    }));
  };

  const agregarProducto = () => {
    const newId = (productos.length + 1).toString();
    setProductos(prev => [...prev, {
      id: newId,
      codigo: '',
      producto: '',
      talla: '',
      color: '',
      colorSesgo: '',
      cantidad: '',
      observaciones: '',
      valorUnitario: '',
      valorRestar: '',
      valorTotal: 0
    }]);
  };

  const eliminarProducto = (id: string) => {
    if (productos.length > 1) {
      setProductos(prev => prev.filter(producto => producto.id !== id));
    }
  };

  const calcularTotales = () => {
    const total = productos.reduce((sum, producto) => sum + producto.valorTotal, 0);
    const totalProductos = productos.reduce((sum, producto) => {
      const cantidad = typeof producto.cantidad === 'string' ? 
        (producto.cantidad === '' ? 0 : parseInt(producto.cantidad)) : 
        producto.cantidad;
      return sum + cantidad;
    }, 0);
    
    return {
      total,
      totalProductos
    };
  };

  const formatearNumero = (numero: number): string => {
    return Math.round(numero).toLocaleString('es-CO');
  };

  const totales = calcularTotales();

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1 className="calculator-title">Calculadora de Costos</h1>
        <Link to="/" className="back-button">
          <i className="fas fa-arrow-left"></i> Volver al Home
        </Link>
      </div>

      {/* Apartado 1: Datos del Confeccionista */}
      <section className="calculator-section">
        <h2 className="section-title">
          <i className="fas fa-user-tie"></i>
          Datos del Confeccionista
        </h2>
        
        <div className="order-number">
          Orden N°: {orderNumber}
        </div>

        <div className="form-grid form-grid-3">
          <div className="form-group">
            <label className="form-label">Nombre Confeccionista <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={confeccionista.nombre}
              onChange={(e) => handleConfeccionistaChange('nombre', e.target.value)}
              placeholder="Nombre completo"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Cédula <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={confeccionista.cedula}
              onChange={(e) => handleConfeccionistaChange('cedula', e.target.value)}
              placeholder="Número de cédula"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              className="form-input"
              value={confeccionista.telefono}
              onChange={(e) => handleConfeccionistaChange('telefono', e.target.value)}
              placeholder="Teléfono de contacto"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              className="form-input"
              value={confeccionista.direccion}
              onChange={(e) => handleConfeccionistaChange('direccion', e.target.value)}
              placeholder="Dirección completa"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Ciudad</label>
            <input
              type="text"
              className="form-input"
              value={confeccionista.ciudad}
              onChange={(e) => handleConfeccionistaChange('ciudad', e.target.value)}
              placeholder="Ciudad"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">País</label>
            <select
              className="form-select"
              value={confeccionista.pais}
              onChange={(e) => handleConfeccionistaChange('pais', e.target.value)}
            >
              <option value="Colombia">Colombia</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Perú">Perú</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Fecha de Inicio <span className="required">*</span></label>
            <input
              type="date"
              className="form-input"
              value={confeccionista.fechaInicio}
              onChange={(e) => handleConfeccionistaChange('fechaInicio', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Plazo de Entrega (días) <span className="required">*</span></label>
            <input
              type="number"
              className="form-input"
              value={confeccionista.plazoEntrega}
              onChange={(e) => handleConfeccionistaChange('plazoEntrega', e.target.value)}
              placeholder="Días"
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Fecha Máxima de Entrega</label>
            <input
              type="date"
              className="form-input"
              value={confeccionista.fechaMaxEntrega}
              disabled
            />
          </div>
        </div>
      </section>

      {/* Apartado 2: Calculadora */}
      <section className="calculator-section">
        <h2 className="section-title">
          <i className="fas fa-calculator"></i>
          Calculadora de Productos
        </h2>
        
        <div className="product-calculator">
          <table className="calculator-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Talla</th>
                <th>Color</th>
                <th>Color Sesgo</th>
                <th>Cantidad</th>
                <th>Observaciones</th>
                <th>Valor Unitario</th>
                <th>Valor a Restar</th>
                <th>Valor Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <input
                      type="text"
                      value={producto.codigo}
                      onChange={(e) => handleProductoChange(producto.id, 'codigo', e.target.value)}
                      placeholder="Código"
                    />
                  </td>
                  <td>
                    <select
                      value={producto.producto}
                      onChange={(e) => handleProductoChange(producto.id, 'producto', e.target.value)}
                    >
                      <option value="">Seleccionar producto</option>
                      <option value="Camiseta">Camiseta</option>
                      <option value="Pantalón">Pantalón</option>
                      <option value="Vestido">Vestido</option>
                      <option value="Chaqueta">Chaqueta</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={producto.talla}
                      onChange={(e) => handleProductoChange(producto.id, 'talla', e.target.value)}
                    >
                      <option value="">Talla</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={producto.color}
                      onChange={(e) => handleProductoChange(producto.id, 'color', e.target.value)}
                    >
                      <option value="">Color</option>
                      <option value="Blanco">Blanco</option>
                      <option value="Negro">Negro</option>
                      <option value="Azul">Azul</option>
                      <option value="Rojo">Rojo</option>
                      <option value="Verde">Verde</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={producto.colorSesgo}
                      onChange={(e) => handleProductoChange(producto.id, 'colorSesgo', e.target.value)}
                    >
                      <option value="">Sin sesgo</option>
                      <option value="Blanco">Blanco</option>
                      <option value="Negro">Negro</option>
                      <option value="Azul">Azul</option>
                      <option value="Rojo">Rojo</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={producto.cantidad}
                      onChange={(e) => handleProductoChange(producto.id, 'cantidad', e.target.value)}
                      min="0"
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={producto.observaciones}
                      onChange={(e) => handleProductoChange(producto.id, 'observaciones', e.target.value)}
                      placeholder="Observaciones"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={producto.valorUnitario}
                      onChange={(e) => handleProductoChange(producto.id, 'valorUnitario', e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={producto.valorRestar}
                      onChange={(e) => handleProductoChange(producto.id, 'valorRestar', e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <strong>${formatearNumero(producto.valorTotal)}</strong>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminarProducto(producto.id)}
                      title="Eliminar producto"
                      disabled={productos.length === 1}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="action-buttons-row">
          <button className="btn btn-primary" onClick={agregarProducto}>
            <i className="fas fa-plus"></i> Agregar Producto
          </button>
          <button className="btn btn-success">
            <i className="fas fa-calculator"></i> Calcular Insumos
          </button>
        </div>

        {/* Resumen de Totales */}
        <div className="totals-summary">
          <div className="totals-grid">
            <div className="total-item">
              <div className="total-label">Total Productos</div>
              <div className="total-value">{totales.totalProductos}</div>
            </div>
            <div className="total-item">
              <div className="total-label">Total</div>
              <div className="total-value primary">${formatearNumero(totales.total)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Apartado 3: Insumos Requeridos */}
      <section className="calculator-section">
        <h2 className="section-title">
          <i className="fas fa-boxes"></i>
          Insumos Requeridos
        </h2>
        
        <div className="supplies-section">
          {/* Insumos Detallados */}
          <div className="supplies-table-container">
            <h3 className="supplies-table-title">
              <i className="fas fa-list-ul"></i>
              Insumos Detallados por Producto
            </h3>
            <table className="supplies-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                </tr>
              </thead>
              <tbody>
                {insumosDetallados.length > 0 ? (
                  insumosDetallados.map((insumo, index) => (
                    <tr key={index}>
                      <td>{insumo.codigo}</td>
                      <td>{insumo.descripcion}</td>
                      <td>{insumo.producto}</td>
                      <td className="quantity-cell">{insumo.cantidad}</td>
                      <td className="unit-cell">{insumo.unidad}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic', padding: '20px' }}>
                      Selecciona productos para ver los insumos detallados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Insumos Generales */}
          <div className="supplies-table-container">
            <h3 className="supplies-table-title">
              <i className="fas fa-layer-group"></i>
              Insumos Generales (Agrupados)
            </h3>
            <table className="supplies-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Cantidad Total</th>
                  <th>Unidad</th>
                </tr>
              </thead>
              <tbody>
                {insumosGenerales.length > 0 ? (
                  insumosGenerales.map((insumo, index) => (
                    <tr key={index}>
                      <td>{insumo.codigo}</td>
                      <td>{insumo.descripcion}</td>
                      <td className="quantity-cell">{insumo.cantidadTotal}</td>
                      <td className="unit-cell">{insumo.unidad}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic', padding: '20px' }}>
                      Los insumos agrupados aparecerán aquí después del cálculo
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="action-buttons-row">
          <button className="btn btn-secondary">
            <i className="fas fa-save"></i> Guardar Borrador
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-file-pdf"></i> Generar PDF
          </button>
          <button className="btn btn-success">
            <i className="fas fa-check"></i> Finalizar Orden
          </button>
        </div>
      </section>
    </div>
  );
};

export default Calculator;

