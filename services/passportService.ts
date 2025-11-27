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
        return apiClient.getWithToken("/api/pasaporte", token);
    },

    async registrar(uid: string, opinion: string, token: string) {
        return apiClient.postWithToken(
            "/pasaporte/registrar",
            {
                uidScaneado: uid,
                opinion
            },
            token
        );
    }
};
