"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePluginManager = exports.PermissionError = exports.usePermissions = exports.Allow = exports.Microkernel = void 0;
// Exportar el core del microkernel
var plugini_1 = require("./plugini");
Object.defineProperty(exports, "Microkernel", { enumerable: true, get: function () { return plugini_1.Microkernel; } });
Object.defineProperty(exports, "Allow", { enumerable: true, get: function () { return plugini_1.Allow; } });
Object.defineProperty(exports, "usePermissions", { enumerable: true, get: function () { return plugini_1.usePermissions; } });
Object.defineProperty(exports, "PermissionError", { enumerable: true, get: function () { return plugini_1.PermissionError; } });
// Exportar el hook para gestión de plugins
var usePluginManager_1 = require("./hooks/usePluginManager");
Object.defineProperty(exports, "usePluginManager", { enumerable: true, get: function () { return usePluginManager_1.usePluginManager; } });
