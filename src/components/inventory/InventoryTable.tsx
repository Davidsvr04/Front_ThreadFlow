import React from 'react';
import type { Supply } from '../../types/inventory';
import { getStockStatusClass, formatStockValue } from '../../utils/inventoryUtils';

interface InventoryTableProps {
  supplies: Supply[];
  onAddQuantity: (supplyId: number, description: string, colorId: number) => void;
  onSubtractQuantity: (supplyId: number, description: string, colorId: number) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  supplies,
  onAddQuantity,
  onSubtractQuantity,
}) => {

  return (
    <div className="inventory-table-container">
      <table className="inventory-table">
        <thead>
          <tr>
            <th className="col-description">Descripción</th>
            <th className="col-category">Categoría</th>
            <th className="col-type">Tipo</th>
            <th className="col-color">Color</th>
            <th className="col-unit">Unidad</th>
            <th className="col-stock">Stock</th>
            <th className="col-status">Estado</th>
            <th className="col-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {supplies.map((supply) => (
            <tr key={supply.idSupply}>
              <td className="col-description">
                {supply.description}
              </td>
              <td className="col-category">
                {supply.supplyType.supplyCategory.name}
              </td>
              <td className="col-type">
                {supply.supplyType.name}
              </td>
              <td className="col-color">
                <span className="color-badge">
                  {supply.supplyColor.name}
                </span>
              </td>
              <td className="col-unit">
                {supply.unitOfMeasure.code}
              </td>
              <td className="col-stock">
                <div className={`stock-value ${getStockStatusClass(supply.stock)}`}>
                  {formatStockValue(supply.stock)}
                </div>
                <span className="stock-unit">
                  {supply.unitOfMeasure.description}
                </span>
              </td>
              <td className="col-status">
                <span className={`status-badge ${supply.active ? 'status-active' : 'status-inactive'}`}>
                  {supply.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="col-actions">
                {supply.active ? (
                  <div className="action-buttons">
                    <button
                      className="action-button add-button"
                      onClick={() => onAddQuantity(supply.idSupply, supply.description, supply.idSupplyColor)}
                      title="Agregar stock"
                    >
                      + Agregar
                    </button>
                    <button
                      className="action-button subtract-button"
                      onClick={() => onSubtractQuantity(supply.idSupply, supply.description, supply.idSupplyColor)}
                      title="Restar stock"
                    >
                      - Restar
                    </button>
                  </div>
                ) : (
                  <span style={{ color: '#7f8c8d', fontSize: '12px' }}>
                    Inactivo
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
