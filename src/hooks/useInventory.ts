import { useState, useEffect, useCallback } from 'react';
import type { Supply, QuantityOperation } from '../types/inventory';
import inventoryService from '../services/inventoryService';

interface UseInventoryReturn {
  supplies: Supply[];
  filteredSupplies: Supply[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  searchTerm: string;
  categoryFilter: string;
  categories: string[];
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string) => void;
  refreshSupplies: () => Promise<void>;
  addQuantityToSupply: (supplyId: number, operation: QuantityOperation) => Promise<void>;
  subtractQuantityFromSupply: (supplyId: number, operation: QuantityOperation) => Promise<void>;
  clearMessages: () => void;
}

export const useInventory = (): UseInventoryReturn => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [filteredSupplies, setFilteredSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Obtener categorías únicas
  const categories = inventoryService.getUniqueCategories(supplies);

  // Función para cargar suministros
  const refreshSupplies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await inventoryService.getSupplies();
      setSupplies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los suministros');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para agregar cantidad
  const addQuantityToSupply = useCallback(async (supplyId: number, operation: QuantityOperation) => {
    try {
      setError(null);
      await inventoryService.addQuantityToSupply(supplyId, operation);
      setSuccessMessage('Cantidad agregada exitosamente');
      await refreshSupplies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar cantidad');
      throw err;
    }
  }, [refreshSupplies]);

  // Función para restar cantidad
  const subtractQuantityFromSupply = useCallback(async (supplyId: number, operation: QuantityOperation) => {
    try {
      setError(null);
      await inventoryService.subtractQuantityFromSupply(supplyId, operation);
      setSuccessMessage('Cantidad restada exitosamente');
      await refreshSupplies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restar cantidad');
      throw err;
    }
  }, [refreshSupplies]);

  // Función para limpiar mensajes
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  // Cargar suministros al montar el componente
  useEffect(() => {
    refreshSupplies();
  }, [refreshSupplies]);

  // Filtrar suministros cuando cambian los filtros
  useEffect(() => {
    let filtered = supplies;

    // Aplicar filtro de búsqueda
    filtered = inventoryService.searchSupplies(filtered, searchTerm);

    // Aplicar filtro de categoría
    filtered = inventoryService.filterSuppliesByCategory(filtered, categoryFilter);

    setFilteredSupplies(filtered);
  }, [supplies, searchTerm, categoryFilter]);

  // Limpiar mensajes automáticamente después de 5 segundos
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, error, clearMessages]);

  return {
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
    clearMessages,
  };
};
