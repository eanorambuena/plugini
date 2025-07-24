import React from 'react'
import { Allow } from '../permissions'

interface Plugin {
  name: string
  enabled: boolean
}

interface PluginListProps {
  availablePlugins: Plugin[]
  activePermissions: Set<string>
  getPluginPermissions: (pluginName: string) => string[]
  onEnablePlugin: (pluginName: string) => void
  onDisablePlugin: (pluginName: string) => void
}

export const PluginList = ({
  availablePlugins,
  activePermissions,
  getPluginPermissions,
  onEnablePlugin,
  onDisablePlugin
}: PluginListProps) => {
  return (
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
              onClick={() => enabled ? onDisablePlugin(name) : onEnablePlugin(name)}
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
                      {isPermissionActive ? '✅' : '❌'} {Allow.getPermissionDescription(permission)}
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
  )
}
