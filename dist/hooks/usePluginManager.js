import { useState, useEffect } from 'react';
export const usePluginManager = (microkernel, allowInstance) => {
    const [enabledPlugins, setEnabledPlugins] = useState([]);
    const [activePermissions, setActivePermissions] = useState(new Set());
    // Inicializar todos los permisos como activos por defecto
    useEffect(() => {
        if (allowInstance) {
            const allPermissions = allowInstance.getAllPermissions().map((p) => p.name);
            setActivePermissions(new Set(allPermissions));
        }
    }, [allowInstance]);
    const buildPluginProps = (pluginName, permissions) => {
        const pluginConfig = microkernel.getPluginConfig(pluginName);
        if (!pluginConfig || !allowInstance)
            return {};
        const pluginProps = {};
        // Automáticamente configurar props basándose en los permisos del plugin
        pluginConfig.permissions.forEach((permissionName) => {
            if (permissions.has(permissionName) && allowInstance[permissionName]) {
                pluginProps[permissionName] = allowInstance[permissionName];
            }
        });
        return pluginProps;
    };
    const handleEnablePlugin = (pluginName) => {
        const pluginProps = buildPluginProps(pluginName, activePermissions);
        const success = microkernel.enablePlugin(pluginName, pluginProps);
        if (success) {
            setEnabledPlugins(microkernel.getEnabledPlugins());
        }
    };
    const handleDisablePlugin = (pluginName) => {
        const success = microkernel.disablePlugin(pluginName);
        if (success) {
            setEnabledPlugins(microkernel.getEnabledPlugins());
        }
    };
    const togglePermission = (permissionName) => {
        const newActivePermissions = new Set(activePermissions);
        if (newActivePermissions.has(permissionName)) {
            newActivePermissions.delete(permissionName);
        }
        else {
            newActivePermissions.add(permissionName);
        }
        setActivePermissions(newActivePermissions);
        // Re-configurar plugins activos con los nuevos permisos
        const currentEnabledPlugins = microkernel.getEnabledPlugins();
        currentEnabledPlugins.forEach(({ name }) => {
            // Deshabilitar primero
            microkernel.disablePlugin(name);
            // Re-habilitar con los nuevos permisos después de un pequeño delay
            setTimeout(() => {
                const pluginProps = buildPluginProps(name, newActivePermissions);
                microkernel.enablePlugin(name, pluginProps);
                // Actualizar el estado para forzar re-render
                setEnabledPlugins(microkernel.getEnabledPlugins());
            }, 100);
        });
    };
    const getPluginPermissions = (pluginName) => {
        const plugin = microkernel.getPluginConfig(pluginName);
        return (plugin === null || plugin === void 0 ? void 0 : plugin.permissions) || [];
    };
    const availablePlugins = microkernel.getAllPlugins();
    return {
        enabledPlugins,
        activePermissions,
        availablePlugins,
        handleEnablePlugin,
        handleDisablePlugin,
        togglePermission,
        getPluginPermissions
    };
};
