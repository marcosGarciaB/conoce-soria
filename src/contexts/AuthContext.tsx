    /*
    * - Centralizamos el token y user + login/logout + restaurar sesión.
    * - Cualquier componente puede leer el estado sin pasar props.
    */

    import React, { createContext, useState, useEffect, ReactNode, useMemo, useContext } from 'react';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { authService } from '../services/authService';
    import { LoginCredentials, AuthResponse } from '../services/authService';

    
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

   
    export const AuthContext = createContext({} as AuthContextProps);

    
    export const AuthProvider = ({ children }: { children: ReactNode }) => {
        const [authState, setAuthState] = useState<AuthState>({
            status: 'checking',
            token: null,
        });

       
        useEffect(() => {
            const checkToken = async () => {
                try {
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
            await AsyncStorage.removeItem('authToken');
            setAuthState({
                status: 'not-authenticated',
                token: null,
            });
        };

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

