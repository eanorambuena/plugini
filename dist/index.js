// Exportar el core del microkernel
export { Microkernel, Allow, usePermissions, PermissionError } from './plugini';
// Exportar el hook para gestión de plugins
export { usePluginManager } from './hooks/usePluginManager';
