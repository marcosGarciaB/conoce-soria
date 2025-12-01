/*
 * Aquí se definen los tipos y funciones relacionadas con el pasaporte.
*/

import { apiClient } from "./apiClient";

export interface RegistroExperienciaDTO {
    experienciaId: string;
    titulo: string;
    categoria: string;
    fechaRegistro: string;
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

    async registerFromQr(token: string, uid: string) {
        return apiClient.postWithToken(
            "/api/pasaporte/registrar",
            { uidScaneado: uid },
            token
        );
    }
};
