// Clase Allow - Permisos específicos de esta aplicación
export class Allow {
    // Permisos relacionados con información básica
    static GetName = () => "World"
    
    // Permisos relacionados con tiempo
    static GetCurrentTime = () => {
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

    // Permisos relacionados con fecha
    static GetCurrentDate = () => {
        const now = new Date()
        return now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    // Permisos relacionados con usuario
    static GetUserName = (name = "Usuario") => () => name
    static GetUserInfo = (userInfo = {}) => () => userInfo

    // Permisos relacionados con sistema
    static GetSystemInfo = () => {
        return {
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            language: navigator.language,
            timestamp: Date.now()
        }
    }

    // Permisos relacionados con ubicación (simulado)
    static GetLocation = () => {
        return {
            city: "Santiago",
            country: "Chile",
            timezone: "America/Santiago"
        }
    }

    // Permisos personalizados para esta aplicación
    static GetWelcomeMessage = () => "¡Bienvenido al sistema de plugins!"
    
    static GetRandomNumber = () => Math.floor(Math.random() * 100)
    
    static GetAppVersion = () => "1.0.0"
}
