import React from 'react'

interface ActivePlugin {
  name: string
  component: any
  props: any
}

interface ActivePluginsProps {
  enabledPlugins: ActivePlugin[]
}

export const ActivePlugins = ({ enabledPlugins }: ActivePluginsProps) => {
  return (
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
  )
}
