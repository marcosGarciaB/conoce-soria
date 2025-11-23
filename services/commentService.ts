/**
 * Aquí se definen los tipos y funciones relacionadas con los comentarios.
 */
import { apiClient } from './apiClient';

export interface ComentariosResponse {
    id:string;
    autorNombre: string;
    texto:string;
    fecha:string;
}

export interface ComentarioPost {
    texto: string;
}


const getComentarios = async (experienciaId: string): Promise<ComentariosResponse[]> => {
    try {
        const response = await apiClient.get<ComentariosResponse[]>(`/api/experiencias/${experienciaId}/comentarios`);
        return response;
    } catch (error) {
        throw error;
    }   
};

const setComentario = async (experienciaId: string, comentario: ComentarioPost, token: string) => {
    return apiClient.postWithToken<ComentariosResponse>(
        `/api/experiencias/${experienciaId}/comentarios`,
        comentario,
        token
    );
};


export const comentariosService = {
    getComentarios,
    setComentario,
};
