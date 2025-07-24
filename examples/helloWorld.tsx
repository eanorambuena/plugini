import React from 'react'
import { usePermissions, PermissionError } from '../plugini'

export const permissions = ['GetName']

export const component = (props) => {
    const allow = usePermissions(props, permissions)
    try {
        const name = allow.GetName()
        return <h1>Hello {name}</h1>
        
    } catch (error) {
        if (error instanceof PermissionError) {
            return <h1>{error.message}</h1>
        }
        throw error
    }
}
