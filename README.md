# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# ThreadFlow - Gestión de Talleres de Confección

ThreadFlow es una aplicación web integral diseñada para la gestión completa de talleres de confección. La aplicación permite optimizar procesos, gestionar inventarios y administrar equipos de trabajo de manera eficiente.

## 🚀 Características Principales

- **📱 Calculadora de Costos**: Herramienta para calcular costos de producción y materiales
- **📦 Gestión de Inventario**: Control completo de materiales y stock
- **👥 Gestión de Confeccionistas**: Administración del equipo de trabajo

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework de JavaScript
- **TypeScript** - Tipado estático
- **Vite** - Herramientas de desarrollo
- **React Router** - Navegación
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP
- **TanStack Query** - Gestión de estado del servidor

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn

## 🚀 Instalación y Configuración

1. Clona el repositorio:
```bash
git clone https://github.com/Davidsvr04/Front_ThreadFlow.git
cd Front_ThreadFlow
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el proyecto en modo desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 🏗️ Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas de la aplicación
├── assets/        # Recursos estáticos
├── App.tsx        # Componente principal
├── main.tsx       # Punto de entrada
└── index.css      # Estilos globales
```

## 🔄 Estado del Proyecto

### ✅ Completado
- [x] Configuración inicial del proyecto
- [x] Vista principal (Home) con navegación
- [x] Diseño responsive con gradientes modernos
- [x] Estructura base de páginas

### 🚧 En Desarrollo
- [ ] Implementación de React Router
- [ ] Calculadora de costos
- [ ] Sistema de inventario
- [ ] Gestión de confeccionistas

### 📋 Por Hacer
- [ ] Autenticación de usuarios
- [ ] Base de datos
- [ ] API Backend
- [ ] Reportes y estadísticas

## 👨‍💻 Desarrollador

**Davidsvr04** - Desarrollador Full Stack

## 📄 Licencia

Este proyecto es privado y está bajo desarrollo.

---

*Optimiza tus procesos textiles con ThreadFlow* 🧵✨

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
