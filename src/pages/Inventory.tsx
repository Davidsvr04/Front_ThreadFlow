import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { QuantityModalData } from '../types/inventory';
import { useInventory } from '../hooks/useInventory';
import { 
  InventoryControls, 
  QuantityModal, 
  InventoryTable, 
  InventorySummary 
} from '../components/inventory';
import '../styles/inventory.css';

const Inventory: React.FC = () => {
  const {
    supplies,
    filteredSupplies,
    loading,
    error,
    successMessage,
    searchTerm,
    categoryFilter,
    categories,
    setSearchTerm,
    setCategoryFilter,
    refreshSupplies,
    addQuantityToSupply,
    subtractQuantityFromSupply,
  } = useInventory();

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<QuantityModalData | null>(null);

  const openQuantityModal = (supplyId: number, supplyDescription: string, action: 'add' | 'subtract') => {
    setModalData({ supplyId, supplyDescription, action });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const handleQuantityOperation = async (supplyId: number, operation: { quantity: number; notes?: string }) => {
    if (!modalData) return;

    if (modalData.action === 'add') {
      await addQuantityToSupply(supplyId, operation);
    } else {
      await subtractQuantityFromSupply(supplyId, operation);
    }
  };

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <h1 className="inventory-title">Sistema de Inventario</h1>
        <Link to="/" className="back-button">
          ← Volver al Home
        </Link>
      </header>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <strong>Éxito:</strong> {successMessage}
        </div>
      )}

      {/* Resumen del inventario */}
      <InventorySummary supplies={supplies} />

      {/* Controles de filtrado */}
      <InventoryControls
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        categories={categories}
        loading={loading}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategoryFilter}
        onRefresh={refreshSupplies}
      />

      {/* Tabla del inventario */}
      {filteredSupplies.length === 0 ? (
        <div className="empty-state">
          <h3>No se encontraron suministros</h3>
          <p>No hay suministros que coincidan con los filtros aplicados.</p>
        </div>
      ) : (
        <InventoryTable
          supplies={filteredSupplies}
          onAddQuantity={(id, description) => openQuantityModal(id, description, 'add')}
          onSubtractQuantity={(id, description) => openQuantityModal(id, description, 'subtract')}
        />
      )}

      {/* Modal para agregar/restar cantidad */}
      {showModal && modalData && (
        <QuantityModal
          modalData={modalData}
          onClose={closeModal}
          onSubmit={handleQuantityOperation}
        />
      )}
    </div>
  );
};

export default Inventory;
