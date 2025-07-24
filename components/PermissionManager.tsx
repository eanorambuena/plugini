import React from 'react'
import { Allow } from '../permissions'

interface PermissionManagerProps {
  activePermissions: Set<string>
  onTogglePermission: (permissionName: string) => void
}

export const PermissionManager = ({
  activePermissions,
  onTogglePermission
}) => {
  return (
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
                  onChange={() => onTogglePermission(name)}
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
  )
}
