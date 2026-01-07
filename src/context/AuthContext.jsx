import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on init
    useEffect(() => {
        const savedUser = localStorage.getItem('mdla-user');
        const token = localStorage.getItem('mdla-token');

        if (savedUser && token) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error loading user:', error);
                localStorage.removeItem('mdla-user');
                localStorage.removeItem('mdla-token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });

            const { token, ...userData } = data;

            // Save token and user data
            localStorage.setItem('mdla-token', token);
            localStorage.setItem('mdla-user', JSON.stringify(userData));
            setUser(userData);

            return { success: true, user: userData };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Email ou mot de passe incorrect'
            };
        }
    };

    const signup = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);

            const { token, ...userInfo } = data;

            // Save token and user data
            localStorage.setItem('mdla-token', token);
            localStorage.setItem('mdla-user', JSON.stringify(userInfo));
            setUser(userInfo);

            return { success: true, user: userInfo };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur lors de l\'inscription'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('mdla-token');
        localStorage.removeItem('mdla-user');
        setUser(null);
    };

    const updateProfile = async (updates) => {
        try {
            const { data } = await api.put(`/users/${user.id}`, updates);

            localStorage.setItem('mdla-user', JSON.stringify(data));
            setUser(data);

            return { success: true, user: data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur lors de la mise à jour'
            };
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup,
        updateProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
