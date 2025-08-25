import type { StockInfo } from '../types/inventory';

/**
 * Utilidades para manejo de datos del inventario
 */

/**
 * Extrae el valor numérico del stock de la estructura StockInfo
 */
export const getStockValue = (stock: StockInfo | null): number | null => {
  if (!stock || !stock.stockActual) return null;
  
  const value = parseFloat(stock.stockActual);
  return isNaN(value) ? null : value;
};

/**
 * Normaliza un valor de stock para asegurar que sea un número válido
 * @deprecated Use getStockValue instead
 */
export const normalizeStock = (stock: unknown): number | null => {
  if (stock === null || stock === undefined) return null;
  
  // Si es el nuevo formato de objeto
  if (typeof stock === 'object' && stock !== null && 'stockActual' in stock) {
    return getStockValue(stock as StockInfo);
  }
  
  if (typeof stock === 'number') {
    return isNaN(stock) ? null : stock;
  }
  
  if (typeof stock === 'string') {
    const parsed = parseFloat(stock);
    return isNaN(parsed) ? null : parsed;
  }
  
  return null;
};

/**
 * Determina la clase CSS basada en el nivel de stock
 */
export const getStockStatusClass = (stock: StockInfo | null): string => {
  const stockValue = getStockValue(stock);
  
  if (stockValue === null || stockValue === 0) return 'no-stock';
  if (stockValue < 10) return 'low-stock';
  return 'good-stock';
};

/**
 * Formatea el valor de stock para mostrar
 */
export const formatStockValue = (stock: StockInfo | null): string => {
  const stockValue = getStockValue(stock);
  
  if (stockValue === null) return 'Sin stock';
  return stockValue.toFixed(2);
};

/**
 * Verifica si un artículo tiene stock disponible
 */
export const hasStock = (stock: StockInfo | null): boolean => {
  const stockValue = getStockValue(stock);
  return stockValue !== null && stockValue > 0;
};

/**
 * Verifica si un artículo tiene stock bajo
 */
export const hasLowStock = (stock: StockInfo | null): boolean => {
  const stockValue = getStockValue(stock);
  return stockValue !== null && stockValue > 0 && stockValue < 10;
};
