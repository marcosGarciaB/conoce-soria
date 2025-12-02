/**
 * Aquí se definen los tipos y funciones relacionadas con las experiencias.
 */
import { apiClient } from './apiClient';

export interface ExperienciasResponse {
    id: number;
    categoria: string;
    imagenPortadaUrl: string;
    titulo: string;
}

export interface ExperienciaDetailResponse {
    id: number;
    titulo: string;
    descripcion: string;
    categoria: string;
    imagenPortadaUrl: string;
    direccion: string;
    ubicacionLat: number;
    ubicacionLng: number;
    galeriaImagenes: string[];
    visible: boolean;
}

const getExperiencias = async (offset = 0, limit = 5): Promise<ExperienciasResponse[]> => {
    try {
        const url = `/api/experiencias/visibles?offset=${offset}&limit=${limit}`;
        const response = await apiClient.get<ExperienciasResponse[]>(url);
        return response;
    } catch (error) {
        throw error;
    }
};

const getExperiencia = async (id: number): Promise<ExperienciaDetailResponse> => {
    try {
        const response = await apiClient.get<ExperienciaDetailResponse>(`/api/experiencias/${id}`);

        return {
            ...response,
            ubicacionLat: Number(response.ubicacionLat),
            ubicacionLng: Number(response.ubicacionLng),
        } as ExperienciaDetailResponse;

    } catch (error) {
        throw error;
    }
};

export const experienciaService = {
    getExperiencias,
    getExperiencia,
};