export class PermissionError extends Error {
    constructor(permission) {
        super(`Error: Permission '${permission}' is not allowed.`)
        this.name = 'PermissionError'
    }
}

export function usePermissions(props, permissions) {
    const allow: Record<string, () => void> = {}

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
