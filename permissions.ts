// Permisos específicos de esta aplicación
import { Allow } from './plugini'

// Registrar permisos básicos del sistema
Allow.registerPermission({
    name: 'GetName',
    func: () => "World",
    description: 'Obtener nombre de usuario'
})

Allow.registerPermission({
    name: 'GetCurrentTime',
    func: () => {
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
    },
    description: 'Acceder a fecha y hora actual'
})

Allow.registerPermission({
    name: 'GetCurrentDate',
    func: () => {
        const now = new Date()
        return now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    },
    description: 'Acceder a fecha actual'
})

Allow.registerPermission({
    name: 'GetUserName',
    func: (name = "Usuario") => () => name,
    description: 'Obtener nombre personalizado del usuario'
})

Allow.registerPermission({
    name: 'GetUserInfo',
    func: (userInfo = {}) => () => userInfo,
    description: 'Acceder a información del usuario'
})

Allow.registerPermission({
    name: 'GetSystemInfo',
    func: () => {
        return {
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            language: navigator.language,
            timestamp: Date.now()
        }
    },
    description: 'Acceder a información del sistema'
})

Allow.registerPermission({
    name: 'GetLocation',
    func: () => {
        return {
            city: "Santiago",
            country: "Chile",
            timezone: "America/Santiago"
        }
    },
    description: 'Acceder a ubicación geográfica'
})

Allow.registerPermission({
    name: 'GetWelcomeMessage',
    func: () => "¡Bienvenido al sistema de plugins!",
    description: 'Obtener mensaje de bienvenida'
})

Allow.registerPermission({
    name: 'GetRandomNumber',
    func: () => Math.floor(Math.random() * 100),
    description: 'Generar número aleatorio'
})

Allow.registerPermission({
    name: 'GetAppVersion',
    func: () => "1.0.0",
    description: 'Obtener versión de la aplicación'
})

// Exportar la clase Allow configurada con todos los permisos
export { Allow }
