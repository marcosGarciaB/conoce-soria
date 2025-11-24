/*
*   Para la gestión del administrador.
*/

import { apiClient } from './apiClient';

export interface UserCredentials {
    nombre: string;
    email: string;
    password?: string;
    role: string;
    puntos: number;
    fechaCreacion?: string;
}

export interface UpdateCredentials {
    nombre?: string;
    email?: string;
    password?: string;
}

const getUserData = async (token: string): Promise<UserCredentials> => {
    try {
        const response = await apiClient.getWithToken<UserCredentials>('/api/auth/me', token);
        return response;
    } catch (error) {
        throw error;
    }
}

const getAllUsers = async (token: string): Promise<UserCredentials[]> => {
    try {
        return await apiClient.getWithToken<UserCredentials[]>('/api/users', token);
    } catch (error) {
        throw error;
    }
}

const getUserByEmail = async (email: string, token: string): Promise<UserCredentials> => {
    try {
        return await apiClient.getWithToken<UserCredentials>(`/api/users/${email}`, token);
    } catch (error) {
        throw error;
    }
}

const updateUser = async (email: string, data: UpdateCredentials, token: string): Promise<UserCredentials> => {
    try {
        return await apiClient.putWithToken<UserCredentials>(`/api/users/${email}`, data, token);
    } catch (error) {
        throw error;
    }
}

const deleteUser = async (email: string, token: string): Promise<void> => {
    try {
        await apiClient.deleteWithToken(`/api/users/${email}`, token);
    } catch (error) {
        throw error;
    }
}

const isAdmin = async (token: string): Promise<boolean> => {
    try {
        const user = await getUserData(token);
        return user.role === "ADMIN";
    } catch (error) {
        return false;
    }
}

export const adminService = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUserByEmail,
    isAdmin,
};
