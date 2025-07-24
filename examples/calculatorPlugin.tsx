import React, { useState } from 'react'
import { usePermissions, PermissionError } from '../plugini'

export const id = 'calculatorPlugin'
export const permissions = ['GetRandomNumber', 'GetSystemInfo']

export const component = (props: any) => {
    const allow = usePermissions(props, permissions)
    const [result, setResult] = useState('')
    const [expression, setExpression] = useState('')

    const calculate = () => {
        try {
            // Evaluación segura básica
            const expr = expression.replace(/[^0-9+\-*/(). ]/g, '')
            const calculatedResult = Function('"use strict"; return (' + expr + ')')()
            setResult(calculatedResult)
        } catch (error) {
            setResult('Error')
        }
    }

    const addRandomNumber = () => {
        try {
            const randomNum = allow.GetRandomNumber()
            setExpression(prev => prev + randomNum.toString())
        } catch (error) {
            if (error instanceof PermissionError) {
                setResult(error.message)
            }
        }
    }

    const getSystemStats = () => {
        try {
            const systemInfo = allow.GetSystemInfo()
            setResult(`Platform: ${systemInfo.platform}`)
        } catch (error) {
            if (error instanceof PermissionError) {
                setResult(error.message)
            }
        }
    }

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            border: '2px solid #28a745'
        }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#28a745' }}>🧮 Calculadora Avanzada</h3>
            
            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="Ingresa una expresión matemática..."
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        marginBottom: '10px'
                    }}
                />
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={calculate} style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        = Calcular
                    </button>
                    
                    <button onClick={addRandomNumber} style={{
                        padding: '8px 16px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        🎲 Número Aleatorio
                    </button>
                    
                    <button onClick={getSystemStats} style={{
                        padding: '8px 16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        💻 Info Sistema
                    </button>
                    
                    <button onClick={() => { setExpression(''); setResult('') }} style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        🗑️ Limpiar
                    </button>
                </div>
            </div>
            
            <div style={{
                padding: '15px',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '18px',
                fontWeight: 'bold',
                textAlign: 'center',
                color: result === 'Error' ? '#dc3545' : '#333'
            }}>
                Resultado: {result || '0'}
            </div>
        </div>
    )
}
