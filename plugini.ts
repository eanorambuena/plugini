export class PermissionError extends Error {
    constructor(permission: string) {
        super(`Error: Permission '${permission}' is not allowed.`)
        this.name = 'PermissionError'
    }
}

export function usePermissions(props: any, permissions: string[]) {
    const allow: Record<string, () => any> = {}

    const grantedPermissions = {
        ...props
    }

    permissions.forEach((permission) => {
        if (grantedPermissions.hasOwnProperty(permission)) {
            allow[permission] = grantedPermissions[permission] || (() => true)
        } else {
            allow[permission] = () => {
                throw new PermissionError(permission)
            }
        }
    })

    return allow
}

// Interfaces para tipado
interface PluginInstance {
    component: any
    permissions: string[]
    enabled: boolean
    instance: any
    props?: any
}

// Microkernel - Gestiona todos los plugins del sistema
export class Microkernel {
    private plugins: Map<string, PluginInstance>
    private services: Map<string, any>

    constructor() {
        this.plugins = new Map()
        this.services = new Map()
    }

    // Registra un plugin en el sistema
    registerPlugin(name: string, plugin: any): void {
        this.plugins.set(name, {
            ...plugin,
            enabled: false,
            instance: null
        })
        console.log(`Plugin "${name}" registrado en el microkernel`)
    }

    // Habilita un plugin específico
    enablePlugin(name: string, props: any = {}): boolean {
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
    disablePlugin(name: string): boolean {
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
    getEnabledPlugins(): Array<{ name: string } & PluginInstance> {
        return Array.from(this.plugins.entries())
            .filter(([name, plugin]) => plugin.enabled)
            .map(([name, plugin]) => ({ name, ...plugin }))
    }

    // Obtiene todos los plugins disponibles
    getAllPlugins(): Array<{ name: string } & PluginInstance> {
        return Array.from(this.plugins.entries())
            .map(([name, plugin]) => ({ name, ...plugin }))
    }

    // Registra un servicio en el microkernel
    registerService(name: string, service: any): void {
        this.services.set(name, service)
        console.log(`Servicio "${name}" registrado en el microkernel`)
    }

    // Obtiene un servicio registrado
    getService(name: string): any {
        return this.services.get(name)
    }

    // Verifica si un plugin está habilitado
    isPluginEnabled(name: string): boolean {
        const plugin = this.plugins.get(name)
        return plugin ? plugin.enabled : false
    }

    // Obtiene la configuración de un plugin específico
    getPluginConfig(name: string): PluginInstance | undefined {
        return this.plugins.get(name)
    }
}
