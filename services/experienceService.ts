/**
 * Aquí se definen los tipos y funciones relacionadas con las experiencias.
 */
import { apiClient } from './apiClient';

export interface ExperienciasResponse {
    id:number;
    categoria: string;
    foto_url:string;
    titulo:string;
}

export interface ExperienciaDetailResponse {
    id: string;
    titulo: string;
    descripcion: string;
    categoria: string;
    imagenPortadaUrl: string;
    direccion: string;
    ubicacionLat: number | null;
    ubicacionLng: number | null;
    visible: boolean;
}

const getExperiencias = async (offset = 0, limit = 5): Promise<ExperienciasResponse[]> => {
    try {
        const url = `/api/experiencias?offset=${offset}&limit=${limit}`;
        const response = await apiClient.get<ExperienciasResponse[]>(url);
        return response;
    } catch (error) {
        throw error;
    }
};

const getExperiencia = async (id: number): Promise<ExperienciaDetailResponse> => {
    try {
        const response = await apiClient.get<ExperienciaDetailResponse>(`/api/experiencias/${id}`);
        return response;
    } catch (error) {
        throw error;
    }   
};

export const experienciaService = {
    getExperiencias,
    getExperiencia,
};