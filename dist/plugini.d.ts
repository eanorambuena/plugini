export declare class PermissionError extends Error {
    constructor(permission: string);
}
export declare class Allow {
    static permissions: Map<string, {
        func: any;
        description: string;
    }>;
    static registerPermission({ name, func, description }: {
        name: string;
        func: any;
        description: string;
    }): void;
    static getPermissionDescription(permissionName: string): string;
    static getAllPermissions(): Array<{
        name: string;
        description: string;
        func: any;
    }>;
    static hasPermission(permissionName: string): boolean;
}
export declare function usePermissions(props: any, permissions: string[]): Record<string, () => any>;
interface PluginInstance {
    component: any;
    permissions: string[];
    enabled: boolean;
    instance: any;
    props?: any;
}
export declare class Microkernel {
    private plugins;
    private services;
    constructor();
    registerPlugin(name: string, plugin: any): void;
    registerPlugins(plugins: any[]): void;
    enablePlugin(name: string, props?: any): boolean;
    disablePlugin(name: string): boolean;
    getEnabledPlugins(): Array<{
        name: string;
    } & PluginInstance>;
    getAllPlugins(): Array<{
        name: string;
    } & PluginInstance>;
    registerService(name: string, service: any): void;
    getService(name: string): any;
    isPluginEnabled(name: string): boolean;
    getPluginConfig(name: string): PluginInstance | undefined;
}
export {};
