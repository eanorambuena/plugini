import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Microkernel } from './plugini'
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
    
    // Configurar props específicos para cada plugin
    if (pluginName === 'helloWorld') {
      pluginProps = { GetName: () => "World" }
    } else if (pluginName === 'timePlugin') {
      pluginProps = { 
        GetCurrentTime: () => {
          const now = new Date()
          return now.toLocaleString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        }
      }
    }
    
    const success = microkernel.enablePlugin(pluginName, pluginProps)
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
