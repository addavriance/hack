import React, { createContext, useState, useContext } from 'react'
import { apiService } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const login = async (username, password) => {
        setLoading(true)
        setError(null)

        try {
            const response = await apiService.login(username, password)

            // После успешного логина устанавливаем пользователя
            const userData = {
                username,
                login_session_uid: response.login_session_uid
            }
            setUser(userData)
            setIsAuthenticated(true)
            localStorage.setItem('user', JSON.stringify(userData))
            return { success: true }
        } catch (error) {
            const errorMessage = error.message || 'Login failed'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    const register = async (username, password) => {
        setLoading(true)
        setError(null)

        try {
            await apiService.register(username, password)
            // Регистрация успешна, но не логиним автоматически
            return { success: true }
        } catch (error) {
            const errorMessage = error.message || 'Registration failed'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        setError(null)
        apiService.clearToken()
        localStorage.removeItem('user')
    }

    // Проверяем наличие пользователя в localStorage при загрузке
    React.useEffect(() => {
        const savedUser = localStorage.getItem('user')
        const savedToken = localStorage.getItem('authToken')

        if (savedUser && savedToken) {
            const userData = JSON.parse(savedUser)
            setUser(userData)
            setIsAuthenticated(true)
            apiService.setToken(savedToken)
        }
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            error,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}
