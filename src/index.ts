// Exportar el core del microkernel
export { Microkernel, Allow, usePermissions, PermissionError } from './plugini'

// Exportar el hook para gestión de plugins
export { usePluginManager } from './hooks/usePluginManager'

// Exportar tipos útiles
export interface Plugin {
  id: string
  permissions: string[]
  component: any
}

export interface PluginInstance {
  Component: any // Cambiado a mayúscula
  permissions: string[]
  enabled: boolean
  instance: any
  props?: any
}

export interface Permission {
  name: string
  description: string
  func: any
}
