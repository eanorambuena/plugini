import React, { useState, useEffect } from 'react'
import { usePermissions, PermissionError } from '../plugini'

export const permissions = ['GetLocation', 'GetCurrentTime']

export const component = (props: any) => {
    const allow = usePermissions(props, permissions)
    const [weather, setWeather] = useState({
        temperature: 22,
        condition: 'Soleado',
        humidity: 65,
        windSpeed: 12
    })
    const [location, setLocation] = useState('')
    const [lastUpdate, setLastUpdate] = useState('')

    const updateWeather = () => {
        try {
            const locationInfo = allow.GetLocation()
            const currentTime = allow.GetCurrentTime()
            
            // Simular datos meteorológicos aleatorios
            const conditions = ['Soleado', 'Nublado', 'Lluvioso', 'Parcialmente nublado', 'Despejado']
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
            const randomTemp = Math.floor(Math.random() * 30) + 5 // 5-35°C
            const randomHumidity = Math.floor(Math.random() * 40) + 30 // 30-70%
            const randomWind = Math.floor(Math.random() * 20) + 5 // 5-25 km/h
            
            setWeather({
                temperature: randomTemp,
                condition: randomCondition,
                humidity: randomHumidity,
                windSpeed: randomWind
            })
            
            setLocation(`${locationInfo.city}, ${locationInfo.country}`)
            setLastUpdate(currentTime)
        } catch (error) {
            if (error instanceof PermissionError) {
                setLocation(error.message)
            }
        }
    }

    useEffect(() => {
        updateWeather()
        const interval = setInterval(updateWeather, 30000) // Actualizar cada 30 segundos
        return () => clearInterval(interval)
    }, [])

    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case 'Soleado': return '☀️'
            case 'Nublado': return '☁️'
            case 'Lluvioso': return '🌧️'
            case 'Parcialmente nublado': return '⛅'
            case 'Despejado': return '🌤️'
            default: return '🌈'
        }
    }

    const getTemperatureColor = (temp: number) => {
        if (temp > 25) return '#ff6b6b'
        if (temp > 15) return '#ffa500'
        return '#4dabf7'
    }

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#e3f2fd',
            borderRadius: '15px',
            border: '2px solid #2196f3',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
        }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1976d2', textAlign: 'center' }}>
                🌤️ Estación Meteorológica
            </h3>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                    {getWeatherIcon(weather.condition)}
                </div>
                <div style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: getTemperatureColor(weather.temperature),
                    marginBottom: '5px'
                }}>
                    {weather.temperature}°C
                </div>
                <div style={{ fontSize: '18px', color: '#1976d2', fontWeight: 'bold' }}>
                    {weather.condition}
                </div>
            </div>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '15px'
            }}>
                <div style={{
                    padding: '10px',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>💧</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Humedad</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{weather.humidity}%</div>
                </div>
                
                <div style={{
                    padding: '10px',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>💨</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Viento</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{weather.windSpeed} km/h</div>
                </div>
            </div>
            
            <div style={{
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#666',
                textAlign: 'center'
            }}>
                📍 {location}<br/>
                🕐 Última actualización: {lastUpdate}
            </div>
            
            <button 
                onClick={updateWeather}
                style={{
                    width: '100%',
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}
            >
                🔄 Actualizar Clima
            </button>
        </div>
    )
}
