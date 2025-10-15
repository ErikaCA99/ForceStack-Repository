/** @type {import('jest').Config} */
const config = {
  // Entorno de prueba
  testEnvironment: 'node',

  // Rutas de los archivos de prueba
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js"
  ],

  // Excluye la carpeta node_modules de la búsqueda
  testPathIgnorePatterns: [
    "/node_modules/"
  ],

  // Módulos que no deben ser transformados por Babel
  transformIgnorePatterns: [
    "/node_modules/(?!@babel/preset-env)"
  ],

  // Mapeo de módulos para resolver rutas
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },

  // Directorio para almacenar la caché de Jest
  cacheDirectory: "<rootDir>/.jest_cache"
};

export default config;