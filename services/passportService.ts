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
        if (!token) {
            throw new Error("Token no disponible para cargar el pasaporte");
        }
        return apiClient.getWithToken("/api/pasaporte", token);
    },

   /* async registerFromQr(token: string, uid: string, opinion: string) {
    return apiClient.postWithToken(
        "/api/pasaporte/registrar",
        { uidScaneado: uid, opinion: opinion },
        token
    );
}*/

//parche para saber el json qu estoy mandando 

async registerFromQr(token: string, uid: string, opinion: string) {

    console.log("🔎 JSON QUE VOY A ENVIAR:", {
        uidScaneado: uid,
        opinion: opinion
    });

    return apiClient.postWithToken(
        "/api/pasaporte/registrar",
        {
            uidScaneado: uid,
            opinion: opinion   // <-- NO puede ser null
        },
        token
    );
}
};