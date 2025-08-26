import type { 
  Supply, 
  VariantQuantityOperation,
  SupplyMovement, 
  CreateSupplyData, 
  UpdateSupplyData,
  BackendSupplyResponse,
  BackendSupply,
  BackendSupplyWithVariants,
  BackendSupplyVariant,
  ApiResponse,
  StockResponse
} from '../types/inventory';

const BASE_URL = '/api/inventory';

// Función auxiliar para transformar datos del backend al frontend
function transformBackendSupplyToSupply(backendSupply: BackendSupply): Supply {
  return {
    idSupply: backendSupply.id_supply,
    description: backendSupply.description,
    active: backendSupply.active,
    idSupplyColor: backendSupply.id_supply_color,
    idSupplyType: backendSupply.id_supply_type,
    measuringUomId: backendSupply.measuring_uom_id,
    supplyColor: {
      idSupplyColor: backendSupply.id_supply_color,
      name: backendSupply.color_name
    },
    supplyType: {
      idSupplyType: backendSupply.id_supply_type,
      name: backendSupply.type_name,
      idSupplyCategory: 1, // Valor por defecto, se puede ajustar
      supplyCategory: {
        idSupplyCategory: 1,
        name: backendSupply.category_name,
        active: true
      }
    },
    unitOfMeasure: {
      idUom: backendSupply.measuring_uom_id,
      code: backendSupply.uom_description.substring(0, 3).toUpperCase(),
      description: backendSupply.uom_description
    },
    stock: {
      idSupply: backendSupply.id_supply,
      stockActual: backendSupply.stock_actual.toString()
    }
  };
}

// Nueva función para transformar variantes en supplies individuales
function transformVariantsToSupplies(backendSupplyWithVariants: BackendSupplyWithVariants): Supply[] {
  return backendSupplyWithVariants.variants.map((variant: BackendSupplyVariant): Supply => ({
    idSupply: backendSupplyWithVariants.id_supply,
    description: `${backendSupplyWithVariants.description} - ${variant.color_name}`,
    active: backendSupplyWithVariants.active,
    idSupplyColor: variant.id_supply_color,
    idSupplyType: backendSupplyWithVariants.id_supply_type,
    measuringUomId: backendSupplyWithVariants.measuring_uom_id,
    supplyColor: {
      idSupplyColor: variant.id_supply_color,
      name: variant.color_name
    },
    supplyType: {
      idSupplyType: backendSupplyWithVariants.id_supply_type,
      name: backendSupplyWithVariants.type_name,
      idSupplyCategory: 1, // Valor por defecto
      supplyCategory: {
        idSupplyCategory: 1,
        name: backendSupplyWithVariants.category_name,
        active: true
      }
    },
    unitOfMeasure: {
      idUom: backendSupplyWithVariants.measuring_uom_id,
      code: backendSupplyWithVariants.uom_description.substring(0, 3).toUpperCase(),
      description: backendSupplyWithVariants.uom_description
    },
    stock: {
      idSupply: variant.id_supply_variant, // Usamos el ID de la variante para el stock
      stockActual: variant.stock_actual.toString()
    }
  }));
}

class InventoryService {
  /**
   * Obtiene la lista de todos los suministros
   */
  async getSupplies(filters?: {
    description?: string;
    id_supply_type?: number;
    id_supply_color?: number;
  }): Promise<Supply[]> {
    try {
      let url = `${BASE_URL}/supplies`;
      
      // Agregar parámetros de consulta si existen
      if (filters) {
        const params = new URLSearchParams();
        if (filters.description) params.append('description', filters.description);
        if (filters.id_supply_type) params.append('id_supply_type', filters.id_supply_type.toString());
        if (filters.id_supply_color) params.append('id_supply_color', filters.id_supply_color.toString());
        
        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const rawData: BackendSupplyResponse = await response.json();
      console.log('Raw API response:', rawData);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (!rawData.success || !Array.isArray(rawData.data)) {
        console.error('Unexpected API response structure:', rawData);
        throw new Error('La respuesta del servidor no tiene el formato esperado');
      }
      
      // Transformar los datos del backend al formato del frontend
      // Cada supply con variantes se convierte en múltiples supplies individuales
      const allSupplies: Supply[] = [];
      rawData.data.forEach((supplyWithVariants: BackendSupplyWithVariants) => {
        const variantSupplies = transformVariantsToSupplies(supplyWithVariants);
        allSupplies.push(...variantSupplies);
      });
      
      return allSupplies;
    } catch (error) {
      console.error('Error fetching supplies:', error);
      throw error;
    }
  }

  /**
   * Agrega cantidad a una variante específica de un suministro
   */
  async addQuantityToSupplyVariant(supplyId: number, operation: VariantQuantityOperation): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/supplies/${supplyId}/variants/add-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operation),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error('Error adding quantity to supply variant:', error);
      throw error;
    }
  }

  /**
   * Resta cantidad de una variante específica de un suministro
   */
  async subtractQuantityFromSupplyVariant(supplyId: number, operation: VariantQuantityOperation): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/supplies/${supplyId}/variants/subtract-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operation),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error('Error subtracting quantity from supply variant:', error);
      throw error;
    }
  }

  /**
   * Obtiene un suministro específico por ID
   */
  async getSupplyById(supplyId: number): Promise<Supply> {
    try {
      const response = await fetch(`${BASE_URL}/supplies/${supplyId}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: ApiResponse<BackendSupply> = await response.json();
      
      // Transformar los datos usando la función auxiliar
      return transformBackendSupplyToSupply(data.data);
    } catch (error) {
      console.error('Error fetching supply by ID:', error);
      throw error;
    }
  }

  /**
   * Filtra suministros por categoría
   */
  filterSuppliesByCategory(supplies: Supply[], category: string): Supply[] {
    if (category === 'all') {
      return supplies;
    }
    
    return supplies.filter(supply =>
      supply.supplyType.supplyCategory.name.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Busca suministros por término de búsqueda
   */
  searchSupplies(supplies: Supply[], searchTerm: string): Supply[] {
    if (!searchTerm.trim()) {
      return supplies;
    }
    
    const term = searchTerm.toLowerCase();
    
    return supplies.filter(supply =>
      supply.description.toLowerCase().includes(term) ||
      supply.supplyColor.name.toLowerCase().includes(term) ||
      supply.supplyType.name.toLowerCase().includes(term) ||
      supply.supplyType.supplyCategory.name.toLowerCase().includes(term)
    );
  }

  /**
   * Obtiene categorías únicas de los suministros
   */
  getUniqueCategories(supplies: Supply[]): string[] {
    const categories = supplies.map(supply => supply.supplyType.supplyCategory.name);
    return [...new Set(categories)];
  }

  /**
   * Valida si una cantidad es válida
   */
  validateQuantity(quantity: string): boolean {
    const num = parseFloat(quantity);
    return !isNaN(num) && num > 0;
  }

  /**
   * Obtiene el stock actual de un suministro específico
   */
  async getSupplyStock(supplyId: number): Promise<{ stockActual: string }> {
    try {
      const response = await fetch(`${BASE_URL}/supplies/${supplyId}/stock`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: StockResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching supply stock:', error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de movimientos de un suministro
   */
  async getSupplyMovements(supplyId: number, limit: number = 20, offset: number = 0): Promise<SupplyMovement[]> {
    try {
      const response = await fetch(`${BASE_URL}/supplies/${supplyId}/movements?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching supply movements:', error);
      throw error;
    }
  }

  /**
   * Obtiene insumos con stock bajo
   */
  async getLowStockSupplies(threshold: number = 10): Promise<Supply[]> {
    try {
      const response = await fetch(`${BASE_URL}/reports/low-stock?threshold=${threshold}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: ApiResponse<BackendSupply[]> = await response.json();
      
      // Transformar los datos usando la función auxiliar
      return data.data.map(transformBackendSupplyToSupply);
    } catch (error) {
      console.error('Error fetching low stock supplies:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo suministro
   */
  async createSupply(supplyData: CreateSupplyData): Promise<Supply> {
    try {
      const response = await fetch(`${BASE_URL}/supplies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplyData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data: ApiResponse<BackendSupply> = await response.json();
      
      // Transformar los datos usando la función auxiliar
      return transformBackendSupplyToSupply(data.data);
    } catch (error) {
      console.error('Error creating supply:', error);
      throw error;
    }
  }

  /**
   * Actualiza un suministro existente
   */
  async updateSupply(supplyId: number, supplyData: UpdateSupplyData): Promise<Supply> {
    try {
      const response = await fetch(`${BASE_URL}/supplies/${supplyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplyData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data: ApiResponse<BackendSupply> = await response.json();
      
      // Transformar los datos usando la función auxiliar
      return transformBackendSupplyToSupply(data.data);
    } catch (error) {
      console.error('Error updating supply:', error);
      throw error;
    }
  }

  /**
   * Elimina un suministro
   */
  async deleteSupply(supplyId: number): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/supplies/${supplyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error('Error deleting supply:', error);
      throw error;
    }
  }
}

// Exportar una instancia única del servicio
export const inventoryService = new InventoryService();
export default inventoryService;
