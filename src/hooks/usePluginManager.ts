import { useState, useEffect } from 'react'
import { Microkernel, Allow, PluginInstance } from '../plugini'

// Definir tipos específicos para el hook
interface EnabledPlugin {
  name: string
  Component: any // Cambiado a mayúscula
  props?: any
}

export const usePluginManager = (microkernel: Microkernel, allowInstance?: any) => {
  const [enabledPlugins, setEnabledPlugins] = useState<EnabledPlugin[]>([])
  const [activePermissions, setActivePermissions] = useState(new Set<string>())

  // Inicializar todos los permisos como activos por defecto
  useEffect(() => {
    if (allowInstance) {
      const allPermissions = allowInstance.getAllPermissions().map((p: any) => p.name)
      setActivePermissions(new Set(allPermissions))
    }
  }, [allowInstance])

  const buildPluginProps = (pluginName: string, permissions: Set<string>) => {
    const pluginConfig = microkernel.getPluginConfig(pluginName)
    if (!pluginConfig || !allowInstance) return {}
    
    const pluginProps: any = {}
    
    // Automáticamente configurar props basándose en los permisos del plugin
    pluginConfig.permissions.forEach((permissionName: string) => {
      if (permissions.has(permissionName) && (allowInstance as any)[permissionName]) {
        pluginProps[permissionName] = (allowInstance as any)[permissionName]
      }
    })
    
    return pluginProps
  }

  const handleEnablePlugin = (pluginName: string) => {
    const pluginProps = buildPluginProps(pluginName, activePermissions)
    const success = microkernel.enablePlugin(pluginName, pluginProps)
    if (success) {
      setEnabledPlugins(microkernel.getEnabledPlugins())
    }
  }

  const handleDisablePlugin = (pluginName: string) => {
    const success = microkernel.disablePlugin(pluginName)
    if (success) {
      setEnabledPlugins(microkernel.getEnabledPlugins())
    }
  }

  const togglePermission = (permissionName: string) => {
    const newActivePermissions = new Set(activePermissions)
    if (newActivePermissions.has(permissionName)) {
      newActivePermissions.delete(permissionName)
    } else {
      newActivePermissions.add(permissionName)
    }
    setActivePermissions(newActivePermissions)
    
    // Re-configurar plugins activos con los nuevos permisos
    const currentEnabledPlugins = microkernel.getEnabledPlugins()
    currentEnabledPlugins.forEach(({ name }) => {
      // Deshabilitar primero
      microkernel.disablePlugin(name)
      
      // Re-habilitar con los nuevos permisos después de un pequeño delay
      setTimeout(() => {
        const pluginProps = buildPluginProps(name, newActivePermissions as Set<string>)
        microkernel.enablePlugin(name, pluginProps)
        // Actualizar el estado para forzar re-render
        setEnabledPlugins(microkernel.getEnabledPlugins())
      }, 100)
    })
  }

  const getPluginPermissions = (pluginName: string) => {
    const plugin = microkernel.getPluginConfig(pluginName)
    return plugin?.permissions || []
  }

  const availablePlugins = microkernel.getAllPlugins()

  return {
    enabledPlugins,
    activePermissions,
    availablePlugins,
    handleEnablePlugin,
    handleDisablePlugin,
    togglePermission,
    getPluginPermissions
  } as const
}
