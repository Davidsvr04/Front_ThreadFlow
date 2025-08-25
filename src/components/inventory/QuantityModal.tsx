import React, { useState } from 'react';
import type { QuantityModalData, QuantityOperation } from '../../types/inventory';
import inventoryService from '../../services/inventoryService';

interface QuantityModalProps {
  modalData: QuantityModalData;
  onClose: () => void;
  onSubmit: (supplyId: number, operation: QuantityOperation) => Promise<void>;
}

const QuantityModal: React.FC<QuantityModalProps> = ({
  modalData,
  onClose,
  onSubmit,
}) => {
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inventoryService.validateQuantity(quantity)) {
      return;
    }

    try {
      setSubmitting(true);
      
      const operation: QuantityOperation = {
        quantity: parseFloat(quantity),
        notes: notes.trim() || undefined,
      };

      await onSubmit(modalData.supplyId, operation);
      onClose();
    } catch {
      // El error ya se maneja en el hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {modalData.action === 'add' ? 'Agregar' : 'Restar'} Cantidad
          </h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Suministro:</label>
            <input
              type="text"
              className="form-input"
              value={modalData.supplyDescription}
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cantidad:</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="form-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ingrese la cantidad"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notas (opcional):</label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ingrese observaciones sobre esta operación..."
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-button secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="modal-button primary"
              disabled={submitting || !inventoryService.validateQuantity(quantity)}
            >
              {submitting ? 'Procesando...' : (modalData.action === 'add' ? 'Agregar' : 'Restar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuantityModal;
