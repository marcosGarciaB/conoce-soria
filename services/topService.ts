/*
 * Aquí se definen los tipos y funciones relacionadas con el top.
 */

import { apiClient } from "./apiClient";

/**
 * Representa un usuario en el ranking/top de puntos.
 */
export interface UsuarioRankingDTO {
	nombre: string;
	puntos: number;
	rol: string;
	fotoPerfilUrl: string;
}

/**
 * Obtiene los datos del ranking/top de usuarios.
 * @returns Promise que resuelve en un array de usuarios (sin tipado específico, devuelve `any[]`)
 */
const getRankingData = async (): Promise<any[]> => {
	try {
		const response = apiClient.get<any[]>("/api/top");
		return response;
	} catch (error) {
		throw error;
	}
};

/**
 * Servicio para interactuar con el ranking/top de usuarios.
 */
export const topService = {
	getRankingData,
};
