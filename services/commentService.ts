/**
 * Aquí se definen los tipos y funciones relacionadas con los comentarios.
 */
import { apiClient } from "./apiClient";

/**
 * Representa un comentario recibido desde el backend.
 */
export interface ComentariosResponse {
	id: string;
	autorNombre: string;
	texto: string;
	fecha: string;
	autorFotoPerfil: string;
	autorId: string;
}

/**
 * Datos necesarios para crear o actualizar un comentario.
 */
export interface ComentarioPost {
	texto: string;
}

/**
 * Obtiene todos los comentarios de una experiencia.
 * @param experienciaId ID de la experiencia
 * @returns Lista de comentarios
 */
const getComentarios = async (
	experienciaId: string
): Promise<ComentariosResponse[]> => {
	try {
		const response = await apiClient.get<ComentariosResponse[]>(
			`/api/experiencias/${experienciaId}/comentarios`
		);
		return response;
	} catch (error) {
		throw error;
	}
};

/**
 * Crea un nuevo comentario para una experiencia.
 * @param experienciaId ID de la experiencia
 * @param comentario Datos del comentario
 * @param token Token de autenticación
 * @returns Comentario creado
 */
const setComentario = async (
	experienciaId: string,
	comentario: ComentarioPost,
	token: string
) => {
	return apiClient.postWithToken<ComentariosResponse>(
		`/api/experiencias/${experienciaId}/comentarios`,
		comentario,
		token
	);
};

/**
 * Actualiza un comentario existente de una experiencia.
 * @param experienciaId ID de la experiencia
 * @param comentarioId ID del comentario a actualizar
 * @param comentario Datos del comentario
 * @param token Token de autenticación
 * @returns Comentario actualizado
 */
const updateComentario = async (
	experienciaId: string,
	comentarioId: string,
	comentario: ComentarioPost,
	token: string
) => {
	return apiClient.putWithToken<ComentariosResponse>(
		`/api/experiencias/${experienciaId}/comentarios/${comentarioId}`,
		comentario,
		token
	);
};

/**
 * Elimina un comentario de una experiencia.
 * @param experienciaId ID de la experiencia
 * @param comentarioId ID del comentario a eliminar
 * @param token Token de autenticación
 */
const deleteComentario = async (
	experienciaId: string,
	comentarioId: string,
	token: string
) => {
	await apiClient.deleteWithToken<ComentariosResponse>(
		`/api/experiencias/${experienciaId}/comentarios/${comentarioId}`,
		token
	);
};

export const comentariosService = {
	getComentarios,
	setComentario,
	updateComentario,
	deleteComentario,
};
