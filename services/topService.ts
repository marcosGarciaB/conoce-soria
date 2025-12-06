/*
 * Aquí se definen los tipos y funciones relacionadas con el top.
*/

import { apiClient } from "./apiClient";

export interface UsuarioRankingDTO {
    nombre: string;
    puntos: number;
    rol: string;
    fotoPerfilUrl: string;
}

const getRankingData = async (): Promise<any[]> => {
    try {
        const response = apiClient.get<any[]>('/api/top');
        return response;
    } catch (error) {
        throw error;
    }
};

export const topService = {
    getRankingData,

}

