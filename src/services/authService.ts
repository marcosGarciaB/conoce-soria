/*
* Utiliza el apiClient para definir funciones claras.
* - Coge las llamadas de la API de autentcación.
* - Define los tipos de datos que se envían y reciben.
*/

import { Alert } from 'react-native';
import { apiClient } from './apiClient';

// ------------------- ENVIAR/RECIBIR DATOS ------------------- //
export interface AuthResponse {
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

// ------------------- LOGIN DEL USUARIO ------------------- //
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
        return response;
    } catch (error) {
        throw error;
    }
};

// -------------------  REGISTRO DEL USUARIO ------------------- //
const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
        await apiClient.post<void>('/api/auth/register', credentials);
    } catch (error) {
        throw error;
    }
}


export const authService = {
    login,
    register,

};
