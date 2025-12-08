/**
 * Aquí se definen los tipos y funciones relacionadas con las experiencias.
 */
import { apiClient } from "./apiClient";

/**
 * Representa una experiencia básica para listados o marcadores.
 */
export interface ExperienciasResponse {
	id: number;
	categoria: string;
	imagenPortadaUrl: string;
	titulo: string;
}

/**
 * Representa el detalle completo de una experiencia.
 */
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
	puntosOtorgados: number;
	activo?: boolean;
}

/**
 * Obtiene una lista de experiencias visibles.
 * @param offset Número de elementos a omitir para paginación (default: 0)
 * @param limit Cantidad máxima de elementos a retornar (default: 5)
 * @returns Lista de experiencias básicas
 */
const getExperiencias = async (
	offset = 0,
	limit = 5
): Promise<ExperienciasResponse[]> => {
	try {
		const url = `/api/experiencias/visibles?offset=${offset}&limit=${limit}`;
		const response = await apiClient.get<ExperienciasResponse[]>(url);
		return response;
	} catch (error) {
		throw error;
	}
};

/**
 * Obtiene el detalle completo de una experiencia por su ID.
 * @param id ID de la experiencia
 * @returns Detalle completo de la experiencia
 */
const getExperiencia = async (
	id: number
): Promise<ExperienciaDetailResponse> => {
	try {
		const response = await apiClient.get<ExperienciaDetailResponse>(
			`/api/experiencias/${id}`
		);

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
