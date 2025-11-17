/**
 * Aquí se definen los tipos y funciones relacionadas con las experiencias.
 */
import { apiClient } from './apiClient';

export interface ExperienciasResponse {
    id:number;
    categoria: string;
    descripcion:string;
    direccion:string;
    foto_url:string;
    titulo:string;
    latitud?:number;
    longitud?:number;
}

const getExperiencias = async (): Promise<ExperienciasResponse[]> => {
    try {
        const response = await apiClient.get<ExperienciasResponse[]>('/api/experiencias');
        return response;
    } catch (error) {
        throw error;
    }   
};

export const experienciaService = {
    getExperiencias,
};