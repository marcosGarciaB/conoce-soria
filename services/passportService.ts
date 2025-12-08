/*
 * Aquí se definen los tipos y funciones relacionadas con el pasaporte.
*/

import { apiClient } from "./apiClient";

export interface RegistroExperienciaDTO {
    experienciaId: string;
    titulo: string;
    categoria: string;
    fechaRegistro: string;
    opinion: string;
    imgPortada: string;
    puntosOtorgados: number;
}

export interface PasaporteDTO {
    usuarioId: string;
    nombreUsuario: string;
    puntosTotales: number;
    registros: RegistroExperienciaDTO[];
}

export const passportService = {
    async getPasaporte(token: string): Promise<PasaporteDTO> {
        try {
            return await apiClient.getWithToken("/api/pasaporte", token);
        } catch (error) {
            console.error('[passportService.getPasaporte] Error al obtener pasaporte', {
                hasToken: !!token,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    },

    async registrar(uid: string, opinion: string, token: string) {
        try {
            return await apiClient.postWithToken(
                "/api/pasaporte/registrar",
                {
                    uidScaneado: uid,
                    opinion
                },
                token
            );
        } catch (error) {
            console.error('[passportService.registrar] Error al registrar experiencia en pasaporte', {
                uid,
                hasToken: !!token,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }

    
};
