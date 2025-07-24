import React from 'react'
import { microkernel } from './config/pluginConfig'
import { usePluginManager } from './hooks/usePluginManager'
import { PermissionManager } from './components/PermissionManager'
import { PluginList } from './components/PluginList'
import { ActivePlugins } from './components/ActivePlugins'

export const App = () => {
  const {
    enabledPlugins,
    activePermissions,
    availablePlugins,
    handleEnablePlugin,
    handleDisablePlugin,
    togglePermission,
    getPluginPermissions
  } = usePluginManager(microkernel)

  return (
    <div style={{ padding: '20px' }}>
      <h2>Microkernel - Sistema de Plugins</h2>
      
      <PermissionManager 
        activePermissions={activePermissions}
        onTogglePermission={togglePermission}
      />
      
      <PluginList 
        availablePlugins={availablePlugins}
        activePermissions={activePermissions}
        getPluginPermissions={getPluginPermissions}
        onEnablePlugin={handleEnablePlugin}
        onDisablePlugin={handleDisablePlugin}
      />

      <ActivePlugins enabledPlugins={enabledPlugins} />
    </div>
  )
}
