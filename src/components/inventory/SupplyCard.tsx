import React from 'react';
import type { Supply } from '../../types/inventory';
import { getStockStatusClass, formatStockValue } from '../../utils/inventoryUtils';

interface SupplyCardProps {
  supply: Supply;
  onAddQuantity: (supplyId: number, description: string) => void;
  onSubtractQuantity: (supplyId: number, description: string) => void;
}

const SupplyCard: React.FC<SupplyCardProps> = ({
  supply,
  onAddQuantity,
  onSubtractQuantity,
}) => {
  return (
    <div className="supply-card">
      <div className="supply-header">
        <h3 className="supply-title">{supply.description}</h3>
        <span className={`supply-status ${supply.active ? 'status-active' : 'status-inactive'}`}>
          {supply.active ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="supply-details">
        <div className="supply-detail">
          <span className="detail-label">Categoría:</span>
          <span className="detail-value">{supply.supplyType.supplyCategory.name}</span>
        </div>
        <div className="supply-detail">
          <span className="detail-label">Tipo:</span>
          <span className="detail-value">{supply.supplyType.name}</span>
        </div>
        <div className="supply-detail">
          <span className="detail-label">Color:</span>
          <span className="detail-value">
            <span className="color-badge">{supply.supplyColor.name}</span>
          </span>
        </div>
        <div className="supply-detail">
          <span className="detail-label">Unidad:</span>
          <span className="detail-value">{supply.unitOfMeasure.description}</span>
        </div>
      </div>

      <div className="stock-info">
        <div className={`stock-value ${getStockStatusClass(supply.stock)}`}>
          {formatStockValue(supply.stock)}
        </div>
        <div className="stock-label">
          {supply.unitOfMeasure.code}
        </div>
      </div>

      {supply.active && (
        <div className="supply-actions">
          <button
            className="action-button add-button"
            onClick={() => onAddQuantity(supply.idSupply, supply.description)}
          >
            + Agregar
          </button>
          <button
            className="action-button subtract-button"
            onClick={() => onSubtractQuantity(supply.idSupply, supply.description)}
          >
            - Restar
          </button>
        </div>
      )}
    </div>
  );
};

export default SupplyCard;
