    /*
    * - Centralizamos el token y user + login/logout + restaurar sesión.
    * - Cualquier componente puede leer el estado sin pasar props.
    */

    import React, { createContext, useState, useEffect, ReactNode, useMemo, useContext } from 'react';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { authService } from '../services/authService';
    import { LoginCredentials, AuthResponse } from '../services/authService';

    // ------------------- DEFINICIÓN DE TIPOS ------------------- //
    interface AuthState {
        status: 'checking' | 'authenticated' | 'not-authenticated';
        token: string | null;
    }

    interface AuthContextProps {
        status: 'checking' | 'authenticated' | 'not-authenticated';
        token: string | null;
        login: (credentials: LoginCredentials) => Promise<void>;
        logout: () => void;
    }

    // ------------------- CREACIÓN DEL CONTEXTO ------------------- //
    // Creamos el contexto con un valor inicial vacío.
    export const AuthContext = createContext({} as AuthContextProps);

    // ------------------- COMPONENTE PROVEEDOR ------------------- //
    // Children es toda la aplicación.
    // Necesito entender bien toda esta parte.
    export const AuthProvider = ({ children }: { children: ReactNode }) => {
        const [authState, setAuthState] = useState<AuthState>({
            status: 'checking',
            token: null,
        });

        // Efecto para restaurar la sesión al iniciar la app.
        useEffect(() => {
            const checkToken = async () => {
                try {
                    // Cogemos el token que hemos guardado con la persistencia.
                    const tokenFromStorge = await AsyncStorage.getItem('authToken');

                    if (!tokenFromStorge) {
                        setAuthState({
                            status: 'not-authenticated',
                            token: null,
                        });
                        return;
                    }

                    setAuthState({
                        status: 'authenticated',
                        token: tokenFromStorge,
                    });
                } catch (error) {
                    console.error('Error al comprobar el token:', error);
                    setAuthState({
                        status: 'not-authenticated',
                        token: null,
                    });
                }
            }
            checkToken();
        }, []);

        const login = async (credentials: LoginCredentials) => {
            try {
                const response: AuthResponse = await authService.login(credentials);
                setAuthState({
                    status: 'authenticated',
                    token: response.token,
                });
                await AsyncStorage.setItem('authToken', response.token);
            } catch (error) {
                console.error('Error al comprobar el token:', error);
                throw error;
            }
        };

        const logout = async () => {
            // Borramos el token del almacenamiento local.
            await AsyncStorage.removeItem('authToken');
            // Actualizamos el estado para reflejar que el usuario ya no está autenticado.
            setAuthState({
                status: 'not-authenticated',
                token: null,
            });
        };

        // useMemo optimiza el rendimiento. Solo volverá a crear este objeto si authState cambia.
        // Evita re-renderizados innecesarios en los componentes que consumen el contexto.
        const authContextValue = useMemo(() => ({
            ...authState, 
            login,       
            logout,      
        }), [authState]);

        return (
            <AuthContext.Provider value={authContextValue}>
                {children}
            </AuthContext.Provider>
        );
    };

    export const useAuth = () => {
        return useContext(AuthContext);
    };

