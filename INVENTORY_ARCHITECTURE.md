# Arquitectura del Módulo de Inventario

## Estructura de Archivos

```
src/
├── components/
│   └── inventory/
│       ├── index.ts                 # Exportaciones de componentes
│       ├── InventoryControls.tsx    # Controles de búsqueda y filtros
│       ├── InventoryTable.tsx       # Tabla principal del inventario
│       ├── InventorySummary.tsx     # Resumen estadístico del inventario
│       ├── QuantityModal.tsx        # Modal para agregar/restar cantidad
│       └── SupplyCard.tsx           # Tarjeta individual de suministro (deprecated)
├── hooks/
│   └── useInventory.ts              # Hook personalizado para manejo de estado
├── pages/
│   └── Inventory.tsx                # Página principal del inventario
├── services/
│   └── inventoryService.ts          # Servicio para API calls
├── styles/
│   └── inventory.css                # Estilos del módulo de inventario
└── types/
    └── inventory.ts                 # Definiciones de tipos TypeScript
```

## Descripción de Componentes

### `useInventory` Hook
Maneja todo el estado relacionado con el inventario:
- **Estado**: supplies, loading, error, successMessage, filtros
- **Operaciones**: fetchSupplies, addQuantity, subtractQuantity
- **Filtros**: búsqueda por texto, filtro por categoría

### `inventoryService`
Servicio que encapsula todas las llamadas a la API:
- `getSupplies()`: Obtiene todos los suministros
- `addQuantityToSupply()`: Agrega cantidad a un suministro
- `subtractQuantityFromSupply()`: Resta cantidad de un suministro
- Métodos utilitarios para filtrado y validación

### Componentes UI

#### `InventoryControls`
- Barra de búsqueda en tiempo real
- Selector de categorías con filtrado dinámico
- Botón de actualizar con estado de carga

#### `InventoryTable`
- **Diseño de tabla profesional** similar a sistemas ERP
- Columnas organizadas: Descripción, Categoría, Tipo, Color, Unidad, Stock, Estado, Acciones
- **Indicadores visuales de stock**:
  - Verde: Stock suficiente
  - Amarillo: Stock bajo (< 10 unidades)
  - Rojo: Sin stock
- Botones de acción integrados por fila
- Diseño responsive con scroll horizontal en móviles

#### `InventorySummary`
- **Dashboard de métricas clave**:
  - Total de artículos
  - Artículos activos
  - Artículos con stock
  - Alertas de stock bajo
  - Artículos sin stock
- Tarjetas con códigos de color para identificación rápida

#### `QuantityModal`
- Modal para capturar cantidad y notas
- Validación de entrada en tiempo real
- Manejo de estado de envío con feedback

### `Inventory` (Página Principal)
Orquesta todos los componentes con diseño tipo ERP:
- Header profesional con navegación
- Panel de resumen ejecutivo
- Controles de filtrado avanzados
- Tabla de datos principal
- Manejo centralizado de modales

## Diseño Visual

### Características del Diseño de Tabla
1. **Header con gradiente**: Azul profesional que resalta los encabezados
2. **Filas con hover**: Efecto visual al pasar el mouse
3. **Badges de estado**: Colores semánticos para estados (activo/inactivo)
4. **Indicadores de stock**: Sistema de colores para niveles de inventario
5. **Botones de acción**: Ubicados estratégicamente en cada fila
6. **Tipografía jerarquizada**: Diferentes pesos y tamaños para mejor legibilidad

### Responsive Design
- **Desktop**: Tabla completa con todas las columnas visibles
- **Tablet**: Scroll horizontal con columnas condensadas
- **Mobile**: Tabla con columnas esenciales y botones apilados

## Flujo de Datos

1. **Carga inicial**: `useInventory` → `inventoryService.getSupplies()` → Tabla + Resumen
2. **Filtrado**: Usuario interactúa → `useInventory` aplica filtros → Re-render tabla
3. **Resumen dinámico**: Cambios en datos → Recálculo automático de métricas
4. **Operaciones de cantidad**: 
   - Usuario hace clic en tabla → Modal se abre
   - Usuario envía → `inventoryService` ejecuta operación
   - `useInventory` refresca datos → Re-render completo

## APIs del Backend Utilizadas

### GET /supplies
Obtiene todos los suministros con sus relaciones.

**Respuesta típica:**
```json
{
  "idSupply": 310,
  "description": "TELA MAT 2",
  "active": true,
  "supplyColor": { "name": "AZUL NOCHE" },
  "supplyType": {
    "name": "LAFAYETTE",
    "supplyCategory": { "name": "TELA" }
  },
  "unitOfMeasure": { "code": "METROS" },
  "stock": 100.5
}
```

### POST /inventory/supplies/:id/add-quantity
Agrega cantidad a un suministro.

**Body:**
```json
{
  "quantity": 100.5,
  "notes": "Compra inicial - Proveedor ABC"
}
```

### POST /inventory/supplies/:id/subtract-quantity
Resta cantidad de un suministro.

**Body:**
```json
{
  "quantity": 15.25,
  "notes": "Consumo para orden de producción #001"
}
```

## Funcionalidades Implementadas

### ✅ Gestión de Inventario
- [x] Visualización en formato tabla profesional
- [x] Búsqueda en tiempo real por múltiples campos
- [x] Filtrado por categorías dinámico
- [x] Resumen ejecutivo con métricas clave
- [x] Indicadores visuales de nivel de stock
- [x] Operaciones de entrada y salida de stock
- [x] Historial de movimientos con notas

### ✅ Experiencia de Usuario
- [x] Diseño similar a sistemas ERP profesionales
- [x] Feedback visual inmediato en todas las acciones
- [x] Estados de carga y error claramente identificados
- [x] Responsive design para todos los dispositivos
- [x] Validación de datos en tiempo real
- [x] Confirmaciones de operaciones exitosas

### ✅ Arquitectura Técnica
- [x] Separación clara de responsabilidades
- [x] Componentes reutilizables y modulares
- [x] Hooks personalizados para lógica de negocio
- [x] Servicio centralizado para APIs
- [x] Tipado completo con TypeScript
- [x] Estilos organizados y mantenibles

## Beneficios del Diseño de Tabla

1. **Profesionalismo**: Apariencia similar a sistemas empresariales reales
2. **Eficiencia**: Más información visible simultáneamente
3. **Escalabilidad**: Fácil agregar nuevas columnas o funcionalidades
4. **Usabilidad**: Navegación familiar para usuarios de sistemas de inventario
5. **Performance**: Mejor rendimiento al mostrar muchos registros
6. **Consistencia**: Diseño uniforme en toda la aplicación

## Próximas Mejoras Sugeridas

- [ ] Exportación a Excel/PDF
- [ ] Ordenamiento por columnas
- [ ] Paginación para grandes conjuntos de datos
- [ ] Filtros avanzados por rango de stock
- [ ] Historial de movimientos por artículo
- [ ] Alertas automáticas de stock mínimo
- [ ] Integración con código de barras
