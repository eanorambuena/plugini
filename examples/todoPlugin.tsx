import React, { useState } from 'react'
import { usePermissions, PermissionError } from '../plugini'

export const permissions = ['GetCurrentTime', 'GetUserName']

interface Task {
    id: number
    text: string
    completed: boolean
    createdAt: string
    priority: 'low' | 'medium' | 'high'
}

export const component = (props: any) => {
    const allow = usePermissions(props, permissions)
    const [tasks, setTasks] = useState([])
    const [newTask, setNewTask] = useState('')
    const [priority, setPriority] = useState('medium')
    const [filter, setFilter] = useState('all')

    const addTask = () => {
        if (newTask.trim()) {
            try {
                const currentTime = allow.GetCurrentTime()
                const task = {
                    id: Date.now(),
                    text: newTask,
                    completed: false,
                    createdAt: currentTime,
                    priority: priority
                }
                setTasks([...tasks, task])
                setNewTask('')
            } catch (error) {
                if (error instanceof PermissionError) {
                    console.error(error.message)
                }
            }
        }
    }

    const toggleTask = (id: number) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ))
    }

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    const getFilteredTasks = () => {
        switch (filter) {
            case 'completed':
                return tasks.filter(task => task.completed)
            case 'pending':
                return tasks.filter(task => !task.completed)
            default:
                return tasks
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return '#dc3545'
            case 'medium': return '#ffc107'
            case 'low': return '#28a745'
            default: return '#6c757d'
        }
    }

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return '🔴'
            case 'medium': return '🟡'
            case 'low': return '🟢'
            default: return '⚪'
        }
    }

    const getWelcomeMessage = () => {
        try {
            const userName = allow.GetUserName()
            return `¡Hola ${userName}! Tienes ${tasks.filter(t => !t.completed).length} tareas pendientes`
        } catch (error) {
            return `Tienes ${tasks.filter(t => !t.completed).length} tareas pendientes`
        }
    }

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#fff3cd',
            borderRadius: '15px',
            border: '2px solid #ffc107'
        }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>✅ Gestor de Tareas</h3>
            
            <div style={{
                fontSize: '14px',
                color: '#856404',
                marginBottom: '20px',
                fontStyle: 'italic'
            }}>
                {getWelcomeMessage()}
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        placeholder="Escribe una nueva tarea..."
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '14px'
                        }}
                    />
                    
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '14px'
                        }}
                    >
                        <option value="low">🟢 Baja</option>
                        <option value="medium">🟡 Media</option>
                        <option value="high">🔴 Alta</option>
                    </select>
                    
                    <button
                        onClick={addTask}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: '#ffc107',
                            color: '#856404',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        ➕ Agregar
                    </button>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    {['all', 'pending', 'completed'].map(filterType => (
                        <button
                            key={filterType}
                            onClick={() => setFilter(filterType)}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: filter === filterType ? '#856404' : '#fff',
                                color: filter === filterType ? '#fff' : '#856404',
                                border: '1px solid #856404',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            {filterType === 'all' ? 'Todas' : 
                             filterType === 'pending' ? 'Pendientes' : 'Completadas'}
                        </button>
                    ))}
                </div>
            </div>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {getFilteredTasks().length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        color: '#856404',
                        fontStyle: 'italic',
                        padding: '20px'
                    }}>
                        {filter === 'all' ? 'No hay tareas' :
                         filter === 'pending' ? 'No hay tareas pendientes' :
                         'No hay tareas completadas'}
                    </div>
                ) : (
                    getFilteredTasks().map(task => (
                        <div
                            key={task.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px',
                                backgroundColor: task.completed ? '#f8f9fa' : '#fff',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                marginBottom: '8px',
                                opacity: task.completed ? 0.7 : 1
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                            />
                            
                            <span style={{ marginRight: '8px' }}>
                                {getPriorityIcon(task.priority)}
                            </span>
                            
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                    fontWeight: task.completed ? 'normal' : 'bold',
                                    marginBottom: '4px'
                                }}>
                                    {task.text}
                                </div>
                                <div style={{
                                    fontSize: '11px',
                                    color: '#666'
                                }}>
                                    📅 {task.createdAt}
                                </div>
                            </div>
                            
                            <button
                                onClick={() => deleteTask(task.id)}
                                style={{
                                    padding: '5px 8px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                🗑️
                            </button>
                        </div>
                    ))
                )}
            </div>
            
            <div style={{
                marginTop: '15px',
                fontSize: '12px',
                color: '#856404',
                textAlign: 'center'
            }}>
                Total: {tasks.length} | Completadas: {tasks.filter(t => t.completed).length} | 
                Pendientes: {tasks.filter(t => !t.completed).length}
            </div>
        </div>
    )
}
