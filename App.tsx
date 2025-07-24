import React, { useState } from 'react'
import { Microkernel } from './plugini'
import { Allow } from './permissions'
import * as helloWorldPlugin from './examples/helloWorld'
import * as timePlugin from './examples/timePlugin'
import * as calculatorPlugin from './examples/calculatorPlugin'
import * as weatherPlugin from './examples/weatherPlugin'
import * as todoPlugin from './examples/todoPlugin'
import * as counterPlugin from './examples/counterPlugin'

const microkernel = new Microkernel()

// Registrar plugins disponibles
microkernel.registerPlugin('helloWorld', helloWorldPlugin)
microkernel.registerPlugin('timePlugin', timePlugin)
microkernel.registerPlugin('calculatorPlugin', calculatorPlugin)
microkernel.registerPlugin('weatherPlugin', weatherPlugin)
microkernel.registerPlugin('todoPlugin', todoPlugin)
microkernel.registerPlugin('counterPlugin', counterPlugin)

export const App = () => {
  const [enabledPlugins, setEnabledPlugins] = useState([])
  const [activePermissions, setActivePermissions] = useState(new Set<string>())

  // Inicializar todos los permisos como activos por defecto
  React.useEffect(() => {
    const allPermissions = Allow.getAllPermissions().map(p => p.name)
    setActivePermissions(new Set(allPermissions))
  }, [])

  const buildPluginProps = (pluginName: string, permissions: Set<string>) => {
    const pluginConfig = microkernel.getPluginConfig(pluginName)
    if (!pluginConfig) return {}
    
    const pluginProps: any = {}
    
    // Automáticamente configurar props basándose en los permisos del plugin
    pluginConfig.permissions.forEach((permissionName: string) => {
      if (permissions.has(permissionName) && (Allow as any)[permissionName]) {
        pluginProps[permissionName] = (Allow as any)[permissionName]
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

  // Función para alternar el estado de un permiso
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
        const pluginProps = buildPluginProps(name, newActivePermissions)
        microkernel.enablePlugin(name, pluginProps)
        // Actualizar el estado para forzar re-render
        setEnabledPlugins(microkernel.getEnabledPlugins())
      }, 100)
    })
  }

  // Función para obtener los permisos que usa cada plugin
  const getPluginPermissions = (pluginName: string) => {
    const plugin = microkernel.getPluginConfig(pluginName)
    return plugin?.permissions || []
  }

  // Función para obtener descripción legible de cada permiso
  const getPermissionDescription = (permission: string) => {
    return Allow.getPermissionDescription(permission)
  }

  const handleDisablePlugin = (pluginName: string) => {
    const success = microkernel.disablePlugin(pluginName)
    if (success) {
      setEnabledPlugins(microkernel.getEnabledPlugins())
    }
  }

  const availablePlugins = microkernel.getAllPlugins()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Microkernel - Sistema de Plugins</h2>
      
      {/* Sección de Gestión de Permisos */}
      <div style={{ marginBottom: '30px' }}>
        <h3>🔐 Gestión de Permisos del Sistema</h3>
        <div style={{
          padding: '15px',
          border: '2px solid #007acc',
          borderRadius: '10px',
          backgroundColor: '#f8f9fa'
        }}>
          <p style={{ margin: '0 0 15px 0', color: '#555' }}>
            Controla qué permisos están disponibles para los plugins:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px' }}>
            {Allow.getAllPermissions().map(({ name, description }) => (
              <div key={name} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  width: '100%'
                }}>
                  <input
                    type="checkbox"
                    checked={activePermissions.has(name)}
                    onChange={() => togglePermission(name)}
                    style={{
                      marginRight: '10px',
                      transform: 'scale(1.2)'
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {description}
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            ⚠️ Cambiar permisos reiniciará automáticamente los plugins activos
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Plugins Disponibles:</h3>
        {availablePlugins.map(({ name, enabled }) => (
          <div key={name} style={{ 
            marginBottom: '15px', 
            padding: '15px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            backgroundColor: enabled ? '#f0f8ff' : '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <button 
                onClick={() => enabled ? handleDisablePlugin(name) : handleEnablePlugin(name)}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: enabled ? '#dc3545' : '#007acc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                {enabled ? `Deshabilitar ${name}` : `Habilitar ${name}`}
              </button>
              <span style={{ 
                color: enabled ? 'green' : 'gray',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {enabled ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>
            
            {/* Mostrar permisos del plugin */}
            <div style={{ marginTop: '10px' }}>
              <strong style={{ fontSize: '14px', color: '#555' }}>Permisos requeridos:</strong>
              <div style={{ marginTop: '5px' }}>
                {getPluginPermissions(name).length > 0 ? (
                  getPluginPermissions(name).map((permission, index) => {
                    const isPermissionActive = activePermissions.has(permission)
                    return (
                      <div key={index} style={{
                        display: 'inline-block',
                        backgroundColor: isPermissionActive ? '#d4edda' : '#f8d7da',
                        color: isPermissionActive ? '#155724' : '#721c24',
                        padding: '4px 8px',
                        margin: '2px 4px 2px 0',
                        borderRadius: '12px',
                        fontSize: '12px',
                        border: `1px solid ${isPermissionActive ? '#c3e6cb' : '#f5c6cb'}`
                      }}>
                        {isPermissionActive ? '✅' : '❌'} {getPermissionDescription(permission)}
                      </div>
                    )
                  })
                ) : (
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#6c757d',
                    fontStyle: 'italic'
                  }}>
                    Sin permisos especiales
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3>Plugins Activos:</h3>
        {enabledPlugins.length === 0 ? (
          <p style={{ color: 'gray' }}>No hay plugins activos</p>
        ) : (
          enabledPlugins.map(({ name, component: Component, props }) => (
            <div key={name} style={{ 
              border: '1px solid #ccc', 
              borderRadius: '8px', 
              padding: '15px', 
              marginBottom: '10px',
              backgroundColor: '#f9f9f9'
            }}>
              <h4>Plugin: {name}</h4>
              <Component {...props} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
