import React, { useState, useEffect } from 'react'
import { usePermissions, PermissionError } from '../plugini'

export const id = 'counterPlugin'
export const permissions = ['GetCurrentTime', 'GetRandomNumber']

export const component = (props: any) => {
    const allow = usePermissions(props, permissions)
    const [count, setCount] = useState(0)
    const [history, setHistory] = useState([])
    const [autoMode, setAutoMode] = useState(false)
    const [lastAction, setLastAction] = useState('')

    const logAction = (action: string, value: number) => {
        try {
            const currentTime = allow.GetCurrentTime()
            const logEntry = {
                action,
                value,
                timestamp: currentTime,
                id: Date.now()
            }
            setHistory(prev => [logEntry, ...prev.slice(0, 9)]) // Mantener últimos 10
            setLastAction(`${action}: ${value} a las ${currentTime}`)
        } catch (error) {
            if (error instanceof PermissionError) {
                setLastAction(`Error: ${error.message}`)
            }
        }
    }

    const increment = () => {
        setCount(prev => prev + 1)
        logAction('Incremento', count + 1)
    }

    const decrement = () => {
        setCount(prev => prev - 1)
        logAction('Decremento', count - 1)
    }

    const reset = () => {
        setCount(0)
        logAction('Reset', 0)
        setHistory([])
    }

    const addRandom = () => {
        try {
            const randomNum = allow.GetRandomNumber()
            const newCount = count + randomNum
            setCount(newCount)
            logAction(`Suma aleatoria (+${randomNum})`, newCount)
        } catch (error) {
            if (error instanceof PermissionError) {
                setLastAction(`Error: ${error.message}`)
            }
        }
    }

    const multiplyByRandom = () => {
        try {
            const randomNum = allow.GetRandomNumber()
            const multiplier = Math.max(1, Math.floor(randomNum / 10)) // 1-10
            const newCount = count * multiplier
            setCount(newCount)
            logAction(`Multiplicación (x${multiplier})`, newCount)
        } catch (error) {
            if (error instanceof PermissionError) {
                setLastAction(`Error: ${error.message}`)
            }
        }
    }

    // Modo automático
    useEffect(() => {
        if (autoMode) {
            const interval = setInterval(() => {
                const actions = [increment, decrement, addRandom]
                const randomAction = actions[Math.floor(Math.random() * actions.length)]
                randomAction()
            }, 2000)
            return () => clearInterval(interval)
        }
    }, [autoMode, count])

    const getCountColor = () => {
        if (count > 100) return '#28a745'
        if (count > 50) return '#ffc107'
        if (count > 0) return '#17a2b8'
        if (count < 0) return '#dc3545'
        return '#6c757d'
    }

    const getCountSize = () => {
        const magnitude = Math.abs(count)
        if (magnitude > 1000) return '48px'
        if (magnitude > 100) return '42px'
        if (magnitude > 10) return '36px'
        return '32px'
    }

    return (
        <div style={{
            padding: '25px',
            backgroundColor: '#f1f3f4',
            borderRadius: '20px',
            border: '3px solid #6c757d',
            textAlign: 'center'
        }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#495057' }}>🔢 Contador Avanzado</h3>
            
            <div style={{
                fontSize: getCountSize(),
                fontWeight: 'bold',
                color: getCountColor(),
                marginBottom: '20px',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '15px',
                border: '2px solid #dee2e6',
                fontFamily: 'monospace'
            }}>
                {count.toLocaleString()}
            </div>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                marginBottom: '20px'
            }}>
                <button onClick={increment} style={{
                    padding: '12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    ➕ +1
                </button>
                
                <button onClick={decrement} style={{
                    padding: '12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    ➖ -1
                </button>
                
                <button onClick={addRandom} style={{
                    padding: '12px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    🎲 + Aleatorio
                </button>
                
                <button onClick={multiplyByRandom} style={{
                    padding: '12px',
                    backgroundColor: '#6f42c1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    ✖️ x Aleatorio
                </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                }}>
                    <input
                        type="checkbox"
                        checked={autoMode}
                        onChange={(e) => setAutoMode(e.target.checked)}
                        style={{ transform: 'scale(1.3)' }}
                    />
                    <span style={{ fontWeight: 'bold' }}>🤖 Modo Automático</span>
                </label>
            </div>
            
            <button onClick={reset} style={{
                padding: '10px 20px',
                backgroundColor: '#fd7e14',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '20px'
            }}>
                🔄 Reset
            </button>
            
            {lastAction && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#495057',
                    marginBottom: '15px'
                }}>
                    📝 Última acción: {lastAction}
                </div>
            )}
            
            {history.length > 0 && (
                <div>
                    <h4 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '14px' }}>
                        📊 Historial (últimas 10 acciones)
                    </h4>
                    <div style={{
                        maxHeight: '150px',
                        overflowY: 'auto',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        padding: '10px'
                    }}>
                        {history.map(entry => (
                            <div key={entry.id} style={{
                                fontSize: '11px',
                                color: '#6c757d',
                                marginBottom: '5px',
                                textAlign: 'left'
                            }}>
                                <strong>{entry.action}</strong> → {entry.value}
                                <br/>
                                <span style={{ color: '#adb5bd' }}>🕐 {entry.timestamp}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
