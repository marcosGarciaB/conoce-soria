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
    puntos: string; // viene como string
    fechaCreacion?: string;
}

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    return response;
};

const register = async (credentials: RegisterCredentials): Promise<void> => {
    await apiClient.post<void>('/api/auth/register', credentials);
};

const getUserData = async (token: string): Promise<UserCredentials> => {
    const response = await apiClient.getWithToken<UserCredentials>('/api/auth/me', token);
    return response;
};

/* 🔥 AÑADIR ESTE MÉTODO NUEVO — OBLIGATORIO */
const getRankingData = async (): Promise<any[]> => {
    return apiClient.get<any[]>('/api/top');
};


/* 🔥 AÑADIRLO AL EXPORT — SIN ESTO NO FUNCIONA */
export const authService = {
    login,
    register,
    getUserData,
    getRankingData
};
