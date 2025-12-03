/*
 * Aquí se definen los tipos y funciones relacionadas con los usuarios.
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
    id: number;
    nombre: string;
    email: string;
    password: string;
    role: string;
    puntos: string;
    fechaCreacion?: string;
    fotoPerfilUrl?: string;
    activo?: boolean;
}

export interface UpdateCredentials {
    nombre?: string;
    email?: string;
    password?: string;
}

export interface UpdateProfilePhoto {
    fotoPerfilUrl: string;
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

const updateUserData = async (token: string, credentials: UpdateCredentials): Promise<UserCredentials> => {
    try {
        const response = await apiClient.putWithToken<UserCredentials>('/api/auth/me', credentials, token);
        return response;
    } catch (error) {
        throw error;
    }
}

const getAllUsers = async (token: string, offset = 0, limit = 5): Promise<UserCredentials[]> => {
    try {
        const url = `/api/users?offset=${offset}&limit=${limit}`;
        const response = await apiClient.getWithToken<UserCredentials[]>(url, token);
        return response;
    } catch (error) {
        throw error;
    }
}

const emailExists = async (email: string): Promise<Boolean> => {
    try {
        const url = `/api/auth/check-email?email=${encodeURIComponent(email)}`;
        const response = await apiClient.get<{ exists: boolean }>(url);
        return response.exists;

    } catch (error) {
        throw error;
    }
}

const changeProfilePhoto = async (token: string, fotoPerfilUrl: string): Promise<UserCredentials> => {
    try {
        const response = await apiClient.putWithToken<UserCredentials>
        ('/api/auth/me/foto-perfil', { fotoPerfilUrl }, token);
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
    getAllUsers,
    emailExists,
    changeProfilePhoto
};
