/*
* Utiliza el apiClient para definir funciones claras.
* - Coge las llamadas de la API de autentcación.
* - Define los tipos de datos que se envían y reciben.
*/

import { apiClient } from './apiClient';

export interface AuthResponse {
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    nombre: string;
    email: string;
    password: string;
}

export interface UserCredentials {
    nombre: string;
    email: string;
    password: string;
    role: string;
    puntos: string;
    fechaCreacion?: string;
}

export interface UpdateCredentials {
    nombre?: string;
    email?: string;
    password?: string;
}

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
        return response;
    } catch (error) {
        throw error;
    }
};

const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
        await apiClient.post<void>('/api/auth/register', credentials);
    } catch (error) {
        throw error;
    }
}

const getUserData = async (token: string): Promise<UserCredentials> => {
    try {
        const response = await apiClient.getWithToken<UserCredentials>('/api/auth/me', token);
        return response;
    } catch (error) {
        throw error;
    }
}

const updateUserData = async (token: string, credentials: UpdateCredentials): Promise<UserCredentials>  => {
try {
        const response = await apiClient.putWithToken<UserCredentials>('/api/auth/me', credentials, token);
        return response;
    } catch (error) {
        throw error;
    }
}

export const authService = {
    login,
    register,
    getUserData,
    updateUserData,
};
