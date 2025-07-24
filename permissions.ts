// Permisos específicos de esta aplicación
import { Allow } from './plugini'

// Registrar permisos básicos del sistema
Allow.registerPermission(
    'GetName', 
    () => "World",
    'Obtener nombre de usuario'
)

Allow.registerPermission(
    'GetCurrentTime',
    () => {
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
    'Acceder a fecha y hora actual'
)

Allow.registerPermission(
    'GetCurrentDate',
    () => {
        const now = new Date()
        return now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    },
    'Acceder a fecha actual'
)

Allow.registerPermission(
    'GetUserName',
    (name = "Usuario") => () => name,
    'Obtener nombre personalizado del usuario'
)

Allow.registerPermission(
    'GetUserInfo',
    (userInfo = {}) => () => userInfo,
    'Acceder a información del usuario'
)

Allow.registerPermission(
    'GetSystemInfo',
    () => {
        return {
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            language: navigator.language,
            timestamp: Date.now()
        }
    },
    'Acceder a información del sistema'
)

Allow.registerPermission(
    'GetLocation',
    () => {
        return {
            city: "Santiago",
            country: "Chile",
            timezone: "America/Santiago"
        }
    },
    'Acceder a ubicación geográfica'
)

Allow.registerPermission(
    'GetWelcomeMessage',
    () => "¡Bienvenido al sistema de plugins!",
    'Obtener mensaje de bienvenida'
)

Allow.registerPermission(
    'GetRandomNumber',
    () => Math.floor(Math.random() * 100),
    'Generar número aleatorio'
)

Allow.registerPermission(
    'GetAppVersion',
    () => "1.0.0",
    'Obtener versión de la aplicación'
)

// Exportar la clase Allow configurada con todos los permisos
export { Allow }
