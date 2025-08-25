import React from 'react';

interface InventoryControlsProps {
  searchTerm: string;
  categoryFilter: string;
  categories: string[];
  loading: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onRefresh: () => void;
}

const InventoryControls: React.FC<InventoryControlsProps> = ({
  searchTerm,
  categoryFilter,
  categories,
  loading,
  onSearchChange,
  onCategoryChange,
  onRefresh,
}) => {
  return (
    <div className="inventory-controls">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por descripción, color, tipo o categoría..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <select
        className="filter-select"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">Todas las categorías</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <button
        className="refresh-button"
        onClick={onRefresh}
        disabled={loading}
      >
        🔄 Actualizar
      </button>
    </div>
  );
};

export default InventoryControls;
