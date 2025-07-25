export { Microkernel, Allow, usePermissions, PermissionError } from './plugini';
export { usePluginManager } from './hooks/usePluginManager';
export interface Plugin {
    id: string;
    permissions: string[];
    component: any;
}
export interface PluginInstance {
    Component: any;
    permissions: string[];
    enabled: boolean;
    instance: any;
    props?: any;
}
export interface Permission {
    name: string;
    description: string;
    func: any;
}
//# sourceMappingURL=index.d.ts.map