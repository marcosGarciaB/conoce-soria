/*
 * Aquí se definen los tipos y funciones relacionadas con el pasaporte.
 */

import { apiClient } from "./apiClient";

/**
 * Representa un registro individual de experiencia en el pasaporte del usuario.
 */
export interface RegistroExperienciaDTO {
	experienciaId: string;
	titulo: string;
	categoria: string;
	fechaRegistro: string;
	opinion: string;
	imgPortada: string;
	puntosOtorgados: number;
}

/**
 * Representa el pasaporte completo de un usuario, incluyendo sus registros y puntos.
 */
export interface PasaporteDTO {
	usuarioId: string;
	nombreUsuario: string;
	puntosTotales: number;
	registros: RegistroExperienciaDTO[];
}

/**
 * Servicio para interactuar con el pasaporte del usuario.
 */
export const passportService = {
	/**
	 * Obtiene el pasaporte completo del usuario.
	 * @param token - Token de autenticación del usuario
	 * @returns Promise que resuelve en un objeto PasaporteDTO
	 */
	async getPasaporte(token: string): Promise<PasaporteDTO> {
		try {
			return await apiClient.getWithToken("/api/pasaporte", token);
		} catch (error) {
			console.error(
				"[passportService.getPasaporte] Error al obtener pasaporte",
				{
					hasToken: !!token,
					error:
						error instanceof Error ? error.message : String(error),
				}
			);
			throw error;
		}
	},

	/**
	 * Registra una experiencia escaneada en el pasaporte del usuario.
	 * @param uid - UID escaneado de la experiencia
	 * @param opinion - Opinión o comentario del usuario sobre la experiencia
	 * @param token - Token de autenticación del usuario
	 * @returns Promise que resuelve en la respuesta del backend
	 */
	async registrar(uid: string, opinion: string, token: string) {
		try {
			return await apiClient.postWithToken(
				"/api/pasaporte/registrar",
				{
					uidScaneado: uid,
					opinion,
				},
				token
			);
		} catch (error) {
			console.error(
				"[passportService.registrar] Error al registrar experiencia en pasaporte",
				{
					uid,
					hasToken: !!token,
					error:
						error instanceof Error ? error.message : String(error),
				}
			);
			throw error;
		}
	},
};
