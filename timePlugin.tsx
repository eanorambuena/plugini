import React, { useState, useEffect } from 'react'
import { usePermissions, PermissionError } from './plugini'

export const permissions = ['GetCurrentTime']

export const component = (props) => {
    const allow = usePermissions(props, permissions)
    const [currentTime, setCurrentTime] = useState('')

    useEffect(() => {
        const updateTime = () => {
            try {
                const time = allow.GetCurrentTime()
                setCurrentTime(time)
            } catch (error) {
                if (error instanceof PermissionError) {
                    setCurrentTime(error.message)
                }
            }
        }

        // Actualizar inmediatamente
        updateTime()
        
        // Actualizar cada segundo
        const interval = setInterval(updateTime, 1000)

        return () => clearInterval(interval)
    }, [allow])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#e8f4fd',
            borderRadius: '10px',
            border: '2px solid #007acc'
        }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#007acc' }}>⏰ Reloj en Tiempo Real</h2>
            <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333',
                fontFamily: 'monospace',
                padding: '10px 20px',
                backgroundColor: '#fff',
                borderRadius: '5px',
                border: '1px solid #ddd'
            }}>
                {currentTime}
            </div>
        </div>
    )
}
