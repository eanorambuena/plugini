"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Microkernel = exports.Allow = exports.PermissionError = void 0;
exports.usePermissions = usePermissions;
class PermissionError extends Error {
    constructor(permission) {
        super(`Error: Permission '${permission}' is not allowed.`);
        this.name = 'PermissionError';
    }
}
exports.PermissionError = PermissionError;
// Clase Allow - Sistema de registro de permisos (core)
class Allow {
    // Método para registrar un permiso con argumentos nombrados
    static registerPermission({ name, func, description }) {
        this.permissions.set(name, {
            func: func,
            description: description
        });
        this[name] = func;
    }
    // Obtener la descripción de un permiso
    static getPermissionDescription(permissionName) {
        const permission = this.permissions.get(permissionName);
        return permission ? permission.description : permissionName;
    }
    // Obtener todos los permisos registrados
    static getAllPermissions() {
        return Array.from(this.permissions.entries()).map(([name, data]) => ({
            name,
            description: data.description,
            func: data.func
        }));
    }
    // Verificar si un permiso existe
    static hasPermission(permissionName) {
        return this.permissions.has(permissionName);
    }
}
exports.Allow = Allow;
// Registro de permisos con funciones y descripciones
Allow.permissions = new Map();
function usePermissions(props, permissions) {
    const allow = {};
    const grantedPermissions = {
        ...props
    };
    permissions.forEach((permission) => {
        if (grantedPermissions.hasOwnProperty(permission)) {
            allow[permission] = grantedPermissions[permission] || (() => true);
        }
        else {
            allow[permission] = () => {
                throw new PermissionError(permission);
            };
        }
    });
    return allow;
}
// Microkernel - Gestiona todos los plugins del sistema
class Microkernel {
    constructor() {
        this.plugins = new Map();
        this.services = new Map();
    }
    // Registra un plugin en el sistema
    registerPlugin(name, plugin) {
        this.plugins.set(name, {
            ...plugin,
            enabled: false,
            instance: null
        });
        console.log(`Plugin "${name}" registrado en el microkernel`);
    }
    // Registra múltiples plugins automáticamente usando sus IDs exportados
    registerPlugins(plugins) {
        plugins.forEach((plugin, index) => {
            // Usar el ID exportado del plugin, o generar uno por defecto
            const pluginId = plugin.id || `plugin_${index}`;
            console.log(`Registrando plugin con ID: "${pluginId}"`);
            this.registerPlugin(pluginId, plugin);
        });
        console.log(`Registrados ${plugins.length} plugins automáticamente`);
    }
    // Habilita un plugin específico
    enablePlugin(name, props = {}) {
        const plugin = this.plugins.get(name);
        if (plugin) {
            plugin.enabled = true;
            plugin.props = props;
            console.log(`Plugin "${name}" habilitado`);
            return true;
        }
        console.warn(`Plugin "${name}" no encontrado`);
        return false;
    }
    // Deshabilita un plugin específico
    disablePlugin(name) {
        const plugin = this.plugins.get(name);
        if (plugin) {
            plugin.enabled = false;
            plugin.props = null;
            console.log(`Plugin "${name}" deshabilitado`);
            return true;
        }
        return false;
    }
    // Obtiene todos los plugins habilitados
    getEnabledPlugins() {
        return Array.from(this.plugins.entries())
            .filter(([name, plugin]) => plugin.enabled)
            .map(([name, plugin]) => ({ name, ...plugin }));
    }
    // Obtiene todos los plugins disponibles
    getAllPlugins() {
        return Array.from(this.plugins.entries())
            .map(([name, plugin]) => ({ name, ...plugin }));
    }
    // Registra un servicio en el microkernel
    registerService(name, service) {
        this.services.set(name, service);
        console.log(`Servicio "${name}" registrado en el microkernel`);
    }
    // Obtiene un servicio registrado
    getService(name) {
        return this.services.get(name);
    }
    // Verifica si un plugin está habilitado
    isPluginEnabled(name) {
        const plugin = this.plugins.get(name);
        return plugin ? plugin.enabled : false;
    }
    // Obtiene la configuración de un plugin específico
    getPluginConfig(name) {
        return this.plugins.get(name);
    }
}
exports.Microkernel = Microkernel;
