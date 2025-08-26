// Estructura de respuesta del backend para supplies con variantes
export interface BackendSupplyResponse {
  success: boolean;
  message: string;
  data: BackendSupplyWithVariants[];
}

export interface BackendSupplyWithVariants {
  id_supply: number;
  description: string;
  active: boolean;
  id_supply_type: number;
  measuring_uom_id: number;
  type_name: string;
  category_name: string;
  uom_description: string;
  total_stock: number;
  variants: BackendSupplyVariant[];
}

export interface BackendSupplyVariant {
  id_supply_variant: number;
  id_supply_color: number;
  color_name: string;
  stock_actual: number;
}

// Mantengo la estructura anterior para compatibilidad con BackendSupply
export interface BackendSupply {
  id_supply: number;
  description: string;
  active: boolean;
  id_supply_color: number;
  id_supply_type: number;
  measuring_uom_id: number;
  color_name: string;
  type_name: string;
  category_name: string;
  uom_description: string;
  stock_actual: number;
}

export interface SupplyColor {
  idSupplyColor: number;
  name: string;
}

export interface SupplyCategory {
  idSupplyCategory: number;
  name: string;
  active: boolean;
}

export interface SupplyType {
  idSupplyType: number;
  name: string;
  idSupplyCategory: number;
  supplyCategory: SupplyCategory;
}

export interface UnitOfMeasure {
  idUom: number;
  code: string;
  description: string;
}

export interface StockInfo {
  idSupply: number;
  stockActual: string;
}

export interface Supply {
  idSupply: number;
  description: string;
  active: boolean;
  idSupplyColor: number;
  idSupplyType: number;
  measuringUomId: number;
  supplyColor: SupplyColor;
  supplyType: SupplyType;
  unitOfMeasure: UnitOfMeasure;
  stock: StockInfo | null;
}

export interface QuantityOperation {
  quantity: number;
  notes?: string;
}

// Nueva interfaz para operaciones de stock por variante
export interface VariantQuantityOperation {
  id_supply_color: number;
  quantity: number;
  notes?: string;
}

export interface QuantityModalData {
  supplyId: number;
  supplyDescription: string;
  colorId: number;
  action: 'add' | 'subtract';
}

export interface SupplyMovement {
  id: number;
  supplyId: number;
  movementType: 'add' | 'subtract';
  quantity: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplyData {
  description: string;
  id_supply_color: number;
  id_supply_type: number;
  measuring_uom_id: number;
}

export interface UpdateSupplyData {
  description?: string;
  id_supply_color?: number;
  id_supply_type?: number;
  measuring_uom_id?: number;
}

// Respuestas genéricas del API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface StockResponse {
  stockActual: string;
}

export interface MovementsResponse {
  movements: SupplyMovement[];
  total: number;
}
