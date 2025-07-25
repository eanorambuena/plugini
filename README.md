# 🔌 Plugini

Un sistema de microkernel extensible para React con gestión de permisos integrada.

## ✨ Características

- 🏗️ **Arquitectura de Microkernel**: Sistema modular y extensible
- 🔐 **Sistema de Permisos**: Control granular de acceso a funcionalidades
- ⚛️ **React Integration**: Hook personalizado para gestión de plugins
- 🎯 **TypeScript**: Tipado completo y seguridad de tipos
- 📦 **Fácil de usar**: API simple y intuitiva
- 🔄 **Hot Reload**: Habilitar/deshabilitar plugins en tiempo real

## 📦 Instalación

```bash
npm install plugini
# o
yarn add plugini
```

## 🚀 Uso Básico

### 1. Crear un Plugin

```typescript
// myPlugin.ts
import React from 'react'
import { usePermissions, PermissionError } from 'plugini'

export const id = 'myPlugin'
export const permissions = ['GetUserData']

export const Component = (props) => {
  const allow = usePermissions(props, permissions)
  
  try {
    const userData = allow.GetUserData()
    return <div>Hola {userData.name}!</div>
  } catch (error) {
    if (error instanceof PermissionError) {
      return <div>Permiso denegado: {error.message}</div>
    }
    return <div>Error: {error.message}</div>
  }
}
```

### 2. Configurar el Microkernel

```typescript
// config.ts
import { Microkernel, Allow } from 'plugini'
import * as myPlugin from './myPlugin'

// Configurar permisos
Allow.registerPermission({
  name: 'GetUserData',
  func: () => ({ name: 'Usuario' }),
  description: 'Acceder a datos del usuario'
})

// Crear microkernel y registrar plugins
export const microkernel = new Microkernel()
microkernel.registerPlugins([myPlugin])
```

### 3. Usar en tu Aplicación React

```typescript
// App.tsx
import React from 'react'
import { usePluginManager } from 'plugini'
import { microkernel } from './config'
import { Allow } from './permissions'

export const App = () => {
  const {
    enabledPlugins,
    activePermissions,
    availablePlugins,
    handleEnablePlugin,
    handleDisablePlugin,
    togglePermission
  } = usePluginManager(microkernel, Allow)

  return (
    <div>
      <h1>Mi Aplicación con Plugins</h1>
      
      {/* Lista de plugins disponibles */}
      {availablePlugins.map(({ name, enabled }) => (
        <div key={name}>
          <button 
            onClick={() => enabled ? handleDisablePlugin(name) : handleEnablePlugin(name)}
          >
            {enabled ? 'Deshabilitar' : 'Habilitar'} {name}
          </button>
        </div>
      ))}

      {/* Plugins activos */}
      {enabledPlugins.map(({ name, Component, props }) => (
        <div key={name}>
          <h3>Plugin: {name}</h3>
          <Component {...props} />
        </div>
      ))}
    </div>
  )
}
```

## 📚 API Reference

### Microkernel

```typescript
const microkernel = new Microkernel()

// Registrar un plugin
microkernel.registerPlugin('pluginId', pluginObject)

// Registrar múltiples plugins
microkernel.registerPlugins([plugin1, plugin2])

// Habilitar/Deshabilitar plugins
microkernel.enablePlugin('pluginId', props)
microkernel.disablePlugin('pluginId')

// Obtener información
microkernel.getAllPlugins()
microkernel.getEnabledPlugins()
microkernel.getPluginConfig('pluginId')
```

### Sistema de Permisos

```typescript
// Registrar un permiso
Allow.registerPermission({
  name: 'PermissionName',
  func: () => 'implementation',
  description: 'Descripción del permiso'
})

// Obtener permisos
Allow.getAllPermissions()
Allow.getPermissionDescription('PermissionName')
Allow.hasPermission('PermissionName')
```

### Hook usePluginManager

```typescript
const {
  enabledPlugins,        // Plugins actualmente habilitados
  activePermissions,     // Set de permisos activos
  availablePlugins,      // Lista de todos los plugins
  handleEnablePlugin,    // Función para habilitar plugin
  handleDisablePlugin,   // Función para deshabilitar plugin
  togglePermission,      // Función para alternar permiso
  getPluginPermissions   // Obtener permisos de un plugin
} = usePluginManager(microkernel, allowInstance)
```

## 🏗️ Estructura de un Plugin

```typescript
// Tu plugin debe exportar:
export const id = 'uniquePluginId'           // ID único
export const permissions = ['Permission1']   // Permisos requeridos
export const Component = (props) => { ... }  // Componente React
```

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor lee las [guías de contribución](CONTRIBUTING.md).

## 📄 Licencia

MIT © [Emmanuel Norambuena](https://github.com/eanorambuena)

## 🔗 Enlaces

- [GitHub](https://github.com/eanorambuena/plugini)
- [NPM](https://www.npmjs.com/package/plugini)
- [Documentación](https://github.com/eanorambuena/plugini#readme)
