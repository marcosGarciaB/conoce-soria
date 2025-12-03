/*
* - Centralizamos el token y user + login/logout + restaurar sesión.
* - Cualquier componente puede leer el estado sin pasar props.
*/

import { apiClient } from '@/services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { AuthResponse, authService, LoginCredentials } from '../services/authService';

interface User {
    email: string;
    nombre: string;
    puntos: number;
}

interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated';
    token: string | null;
    user: User | null;
}

interface AuthContextProps {
    status: 'checking' | 'authenticated' | 'not-authenticated';
    token: string | null;
    user: User | null;

    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;

    refreshUserData: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [authState, setAuthState] = useState<AuthState>({
        status: 'checking',
        token: null,
        user: null,
    });

    useEffect(() => {
        const checkToken = async () => {
            try {
                const tokenFromStorage = await AsyncStorage.getItem('authToken');

                if (!tokenFromStorage) {
                    setAuthState({
                        status: 'not-authenticated',
                        token: null,
                        user: null
                    });
                    return;
                }
                setAuthState({
                    status: 'authenticated',
                    token: tokenFromStorage,
                    user: null,
                });
                await refreshUserData(tokenFromStorage);

            } catch (error) {
                console.error("Error al comprobar el token:", error);
                setAuthState({
                    status: 'not-authenticated',
                    token: null,
                    user: null,
                });
            }
        };

        checkToken();
    }, []);
    const login = async (credentials: LoginCredentials) => {
        const response: AuthResponse = await authService.login(credentials);

        await AsyncStorage.setItem("authToken", response.token);

        setAuthState({
            status: "authenticated",
            token: response.token,
            user: null,
        });

        await refreshUserData(response.token);
    };

    const logout = async () => {
        await AsyncStorage.removeItem("authToken");
        setAuthState({
            status: "not-authenticated",
            token: null,
            user: null,
        });
    };

    const refreshUserData = async (tokenParam?: string) => {
        const tokenToUse = tokenParam ?? authState.token;
        if (!tokenToUse) return;

        try {
            const me = await apiClient.getWithToken<User>("/api/users/me", tokenToUse);

            setAuthState(prev => ({
                ...prev,
                user: me
            }));
        } catch (err) {
            console.error("Error cargando /me", err);
        }
    };

    const value = useMemo(() => ({
        status: authState.status,
        token: authState.token,
        user: authState.user,
        login,
        logout,
        refreshUserData,
    }), [authState]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
