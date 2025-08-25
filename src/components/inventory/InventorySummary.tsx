import React from 'react';
import type { Supply } from '../../types/inventory';
import { hasStock, hasLowStock } from '../../utils/inventoryUtils';

interface InventorySummaryProps {
  supplies: Supply[];
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ supplies }) => {
  const totalItems = supplies.length;
  const activeItems = supplies.filter(s => s.active).length;
  const itemsWithStock = supplies.filter(s => hasStock(s.stock)).length;
  const lowStockItems = supplies.filter(s => hasLowStock(s.stock)).length;
  const outOfStockItems = supplies.filter(s => !hasStock(s.stock)).length;

  return (
    <div className="inventory-summary">
      <div className="summary-card">
        <div className="summary-value">{totalItems}</div>
        <div className="summary-label">Total de Artículos</div>
      </div>
      
      <div className="summary-card">
        <div className="summary-value" style={{ color: '#27ae60' }}>{activeItems}</div>
        <div className="summary-label">Artículos Activos</div>
      </div>
      
      <div className="summary-card">
        <div className="summary-value" style={{ color: '#3498db' }}>{itemsWithStock}</div>
        <div className="summary-label">Con Stock</div>
      </div>
      
      <div className="summary-card">
        <div className="summary-value" style={{ color: '#f39c12' }}>{lowStockItems}</div>
        <div className="summary-label">Stock Bajo</div>
      </div>
      
      <div className="summary-card">
        <div className="summary-value" style={{ color: '#e74c3c' }}>{outOfStockItems}</div>
        <div className="summary-label">Sin Stock</div>
      </div>
    </div>
  );
};

export default InventorySummary;
