import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as helloWorldPlugin from './helloWorld'

// Microkernel - Gestiona todos los plugins del sistema
class Microkernel {
  constructor() {
    this.plugins = new Map()
    this.services = new Map()
  }

  // Registra un plugin en el sistema
  registerPlugin(name, plugin) {
    this.plugins.set(name, {
      ...plugin,
      enabled: false,
      instance: null
    })
    console.log(`Plugin "${name}" registrado en el microkernel`)
  }

  // Habilita un plugin específico
  enablePlugin(name, props = {}) {
    const plugin = this.plugins.get(name)
    if (plugin) {
      plugin.enabled = true
      plugin.props = props
      console.log(`Plugin "${name}" habilitado`)
      return true
    }
    console.warn(`Plugin "${name}" no encontrado`)
    return false
  }

  // Deshabilita un plugin específico
  disablePlugin(name) {
    const plugin = this.plugins.get(name)
    if (plugin) {
      plugin.enabled = false
      plugin.props = null
      console.log(`Plugin "${name}" deshabilitado`)
      return true
    }
    return false
  }

  // Obtiene todos los plugins habilitados
  getEnabledPlugins() {
    return Array.from(this.plugins.entries())
      .filter(([name, plugin]) => plugin.enabled)
      .map(([name, plugin]) => ({ name, ...plugin }))
  }

  // Obtiene todos los plugins disponibles
  getAllPlugins() {
    return Array.from(this.plugins.entries())
      .map(([name, plugin]) => ({ name, ...plugin }))
  }
}

// Instancia global del microkernel
const microkernel = new Microkernel()

// Registrar plugins disponibles
microkernel.registerPlugin('helloWorld', helloWorldPlugin)

const App = () => {
  const [enabledPlugins, setEnabledPlugins] = useState([])

  const handleEnablePlugin = (pluginName) => {
    const success = microkernel.enablePlugin(pluginName, { GetName: () => "World" })
    if (success) {
      setEnabledPlugins(microkernel.getEnabledPlugins())
    }
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
          <div key={name} style={{ marginBottom: '10px' }}>
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
              fontWeight: 'bold'
            }}>
              {enabled ? 'ACTIVO' : 'INACTIVO'}
            </span>
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
