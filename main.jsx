import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Microkernel } from './plugini'
import { Allow } from './permissions'
import * as helloWorldPlugin from './examples/helloWorld'
import * as timePlugin from './examples/timePlugin'

const microkernel = new Microkernel()

// Registrar plugins disponibles
microkernel.registerPlugin('helloWorld', helloWorldPlugin)
microkernel.registerPlugin('timePlugin', timePlugin)

const App = () => {
  const [enabledPlugins, setEnabledPlugins] = useState([])

  const handleEnablePlugin = (pluginName) => {
    let pluginProps = {}
    
    // Configurar props específicos para cada plugin usando Allow
    if (pluginName === 'helloWorld') {
      pluginProps = { GetName: Allow.GetName }
    } else if (pluginName === 'timePlugin') {
      pluginProps = { GetCurrentTime: Allow.GetCurrentTime }
    }
    
    const success = microkernel.enablePlugin(pluginName, pluginProps)
    if (success) {
      setEnabledPlugins(microkernel.getEnabledPlugins())
    }
  }

  // Función para obtener los permisos que usa cada plugin
  const getPluginPermissions = (pluginName) => {
    const plugin = microkernel.getPluginConfig(pluginName)
    return plugin?.permissions || []
  }

  // Función para obtener descripción legible de cada permiso
  const getPermissionDescription = (permission) => {
    return Allow.getPermissionDescription(permission)
  }

  const handleDisablePlugin = (pluginName) => {
    const success = microkernel.disablePlugin(pluginName)
    if (success) {
      setEnabledPlugins(microkernel.getEnabledPlugins())
    }
  }

  const availablePlugins = microkernel.getAllPlugins()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Microkernel - Sistema de Plugins</h2>
      
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
                  getPluginPermissions(name).map((permission, index) => (
                    <div key={index} style={{
                      display: 'inline-block',
                      backgroundColor: '#e9ecef',
                      color: '#495057',
                      padding: '4px 8px',
                      margin: '2px 4px 2px 0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      border: '1px solid #ced4da'
                    }}>
                      🔒 {getPermissionDescription(permission)}
                    </div>
                  ))
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

const root = createRoot(document.getElementById('root'))

root.render(<App />)
