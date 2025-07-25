import { Microkernel, PluginInstance } from '../plugini';
interface EnabledPlugin {
    name: string;
    Component: any;
    props?: any;
}
export declare const usePluginManager: (microkernel: Microkernel, allowInstance?: any) => {
    readonly enabledPlugins: EnabledPlugin[];
    readonly activePermissions: Set<string>;
    readonly availablePlugins: ({
        name: string;
    } & PluginInstance)[];
    readonly handleEnablePlugin: (pluginName: string) => void;
    readonly handleDisablePlugin: (pluginName: string) => void;
    readonly togglePermission: (permissionName: string) => void;
    readonly getPluginPermissions: (pluginName: string) => string[];
};
export {};
//# sourceMappingURL=usePluginManager.d.ts.map