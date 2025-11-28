/*
*   Para la gestión del administrador.
*/

import { apiClient } from './apiClient';
import { UpdateCredentials, UserCredentials } from './authService';
import { ExperienciaDetailResponse, experienciaService, ExperienciasResponse } from './experienceService';

export interface NewUser {
    nombre: string;
    email: string;
    password: string;
    role: string;
}
export interface NewExperience {
    titulo: string;
    descripcion: string;
    categoria: string;
    imagenPortadaUrl: string;
    direccion: string;
    ubicacionLat: number;
    ubicacionLng: number;
}

// Sección usuarios
const getUserData = async (token: string): Promise<UserCredentials> => {
    try {
        const response = await apiClient.getWithToken<UserCredentials>('/api/auth/me', token);
        return response;
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

const createUser = async (data: NewUser, token: string): Promise<UserCredentials> => {
    try {
        return await apiClient.postWithToken<UserCredentials>(`/api/users`, data, token);
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

// Sección experiencias
const getAllExperiencesAdmin = async (token: string, offset = 0, limit = 5): Promise<ExperienciaDetailResponse[]> => {
    try {
        const url = `/api/experiencias/admin?offset=${offset}&limit=${limit}`;
        const experiencia = await apiClient.getWithToken<ExperienciasResponse[]>(url, token);
        const detalles: ExperienciaDetailResponse[] = await Promise.all(
            experiencia.map(e => experienciaService.getExperiencia(e.id))
        );
        return detalles;
    } catch (error) {
        throw error;
    }
};

const createExperiencia = async (data: NewExperience, token: string): Promise<ExperienciaDetailResponse> => {
    try {
        const response = await apiClient.postWithToken<ExperienciaDetailResponse>(`/api/experiencias`, data, token);
        return response;
    } catch (error) {
        throw error;
    }
};

const updateExperiencia = async (id: number, data: NewExperience, token: string): Promise<ExperienciaDetailResponse> => {
    try {
        const response = await apiClient.putWithToken<ExperienciaDetailResponse>(`/api/experiencias/${id}`, data, token);
        return response;
    } catch (error) {
        throw error;
    }
};

const deleteExperiencia = async (id: number, token: string): Promise<ExperienciaDetailResponse> => {
    try {
        const response = await apiClient.deleteWithToken<ExperienciaDetailResponse>(`/api/experiencias/${id}`, token);
        return response;
    } catch (error) {
        throw error;
    }
};

export const adminService = {
    createUser,
    updateUser,
    deleteUser,
    getUserByEmail,
    isAdmin,
    createExperiencia,
    updateExperiencia,
    deleteExperiencia,
    getAllExperiencesAdmin,
};
