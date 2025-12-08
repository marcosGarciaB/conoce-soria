/*
 *   Para la gestión del administrador.
 */

import { apiClient } from "./apiClient";
import { UpdateCredentials, UserCredentials } from "./authService";
import {
	ExperienciaDetailResponse,
	experienciaService,
	ExperienciasResponse,
} from "./experienceService";

/**
 * Nuevo usuario a crear
 */
export interface NewUser {
	nombre: string;
	email: string;
	password: string;
	role: string;
	fotoPerfilUrl: string;
}

/**
 * Nueva experiencia a crear o actualizar
 */
export interface NewExperience {
	titulo: string;
	descripcion: string;
	categoria: string;
	imagenPortadaUrl: string;
	galeriaImagenes?: string[];
	direccion: string;
	ubicacionLat: number;
	ubicacionLng: number;
	puntosOtorgados: number;
	activo?: boolean;
}

// Sección UIDs

/**
 * DTO de UIDs generados por experiencia
 */
export interface ExperienciaUIDDTO {
	id: string;
	uid: string;
	activo: boolean;
	fechaGeneracion: string;
}

/**
 * Respuesta al generar UIDs
 */
export interface UIDResponse {
	experienciaId: string;
	cantidadGenerados: number;
	uids: string[];
}

/**
 * Respuesta al obtener QR code
 */
export interface QRCodeResponse {
	qrCode: string;
}

// Sección usuarios

/**
 * Obtiene los datos del usuario autenticado
 * @param token Token de autenticación
 * @returns Información del usuario
 */
const getUserData = async (token: string): Promise<UserCredentials> => {
	try {
		const response = await apiClient.getWithToken<UserCredentials>(
			"/api/auth/me",
			token
		);
		return response;
	} catch (error) {
		throw error;
	}
};

/**
 * Obtiene un usuario por email
 * @param email Email del usuario
 * @param token Token de autenticación
 * @returns Información del usuario
 */
const getUserByEmail = async (
	email: string,
	token: string
): Promise<UserCredentials> => {
	try {
		return await apiClient.getWithToken<UserCredentials>(
			`/api/users/${email}`,
			token
		);
	} catch (error) {
		throw error;
	}
};

/**
 * Actualiza los datos de un usuario
 * @param email Email del usuario
 * @param data Datos a actualizar
 * @param token Token de autenticación
 * @returns Usuario actualizado
 */
const updateUser = async (
	email: string,
	data: UpdateCredentials,
	token: string
): Promise<UserCredentials> => {
	try {
		return await apiClient.putWithToken<UserCredentials>(
			`/api/users/${email}`,
			data,
			token
		);
	} catch (error) {
		throw error;
	}
};

/**
 * Crea un nuevo usuario
 * @param data Datos del usuario
 * @param token Token de autenticación
 * @returns Usuario creado
 */
const createUser = async (
	data: NewUser,
	token: string
): Promise<UserCredentials> => {
	try {
		return await apiClient.postWithToken<UserCredentials>(
			`/api/users`,
			data,
			token
		);
	} catch (error) {
		throw error;
	}
};

/**
 * Elimina un usuario
 * @param id ID del usuario
 * @param token Token de autenticación
 */
const deleteUser = async (id: number, token: string): Promise<void> => {
	try {
		await apiClient.deleteWithToken(`/api/users/${id}`, token);
	} catch (error) {
		throw error;
	}
};

/**
 * Comprueba si el usuario autenticado es administrador
 * @param token Token de autenticación
 * @returns true si es administrador, false en otro caso
 */
const isAdmin = async (token: string): Promise<boolean> => {
	try {
		const user = await getUserData(token);
		return user.role === "ADMIN";
	} catch (error) {
		return false;
	}
};

// Sección experiencias

/**
 * Obtiene todas las experiencias con detalles para administración
 * @param token Token de autenticación
 * @param offset Número de elementos a omitir
 * @param limit Cantidad máxima de elementos a traer
 * @returns Lista de experiencias con detalle completo
 */
const getAllExperiencesAdmin = async (
	token: string,
	offset = 0,
	limit = 5
): Promise<ExperienciaDetailResponse[]> => {
	try {
		const url = `/api/experiencias/admin?offset=${offset}&limit=${limit}`;
		const experiencia = await apiClient.getWithToken<
			ExperienciasResponse[]
		>(url, token);
		const detalles: ExperienciaDetailResponse[] = await Promise.all(
			experiencia.map((e) => experienciaService.getExperiencia(e.id))
		);
		return detalles;
	} catch (error) {
		throw error;
	}
};

/**
 * Crea una nueva experiencia
 * @param data Datos de la experiencia
 * @param token Token de autenticación
 * @returns Experiencia creada con detalle completo
 */
const createExperiencia = async (
	data: NewExperience,
	token: string
): Promise<ExperienciaDetailResponse> => {
	try {
		const response =
			await apiClient.postWithToken<ExperienciaDetailResponse>(
				`/api/experiencias`,
				data,
				token
			);
		return response;
	} catch (error) {
		throw error;
	}
};

/**
 * Actualiza una experiencia existente
 * @param id ID de la experiencia
 * @param data Datos de actualización
 * @param token Token de autenticación
 * @returns Experiencia actualizada
 */
const updateExperiencia = async (
	id: number,
	data: NewExperience,
	token: string
): Promise<ExperienciaDetailResponse> => {
	try {
		const response =
			await apiClient.putWithToken<ExperienciaDetailResponse>(
				`/api/experiencias/${id}`,
				data,
				token
			);
		return response;
	} catch (error) {
		throw error;
	}
};

/**
 * Elimina una experiencia
 * @param id ID de la experiencia
 * @param token Token de autenticación
 * @returns Experiencia eliminada
 */
const deleteExperiencia = async (
	id: number,
	token: string
): Promise<ExperienciaDetailResponse> => {
	try {
		const response =
			await apiClient.deleteWithToken<ExperienciaDetailResponse>(
				`/api/experiencias/${id}`,
				token
			);
		return response;
	} catch (error) {
		throw error;
	}
};

// Sección UIDs

/**
 * Genera UIDs para una experiencia
 * @param experienciaId ID de la experiencia
 * @param cantidad Cantidad de UIDs a generar
 * @param token Token de autenticación
 * @returns Respuesta con los UIDs generados
 */
const generarUIDs = async (
	experienciaId: number,
	cantidad: number,
	token: string
): Promise<UIDResponse> => {
	try {
		const url = `/api/experiencias/${experienciaId}/generar-uid?cantidad=${cantidad}`;
		const response = await apiClient.postWithToken<UIDResponse>(
			url,
			{},
			token
		);
		return response;
	} catch (error) {
		console.error("[adminService.generarUIDs] Error al generar UIDs", {
			experienciaId,
			cantidad,
			hasToken: !!token,
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
};

/**
 * Obtiene los UIDs generados para una experiencia
 * @param experienciaId ID de la experiencia
 * @param token Token de autenticación
 * @returns Lista de UIDs
 */
const getUIDs = async (
	experienciaId: number,
	token: string
): Promise<ExperienciaUIDDTO[]> => {
	try {
		const url = `/api/experiencias/${experienciaId}/uids`;
		const response = await apiClient.getWithToken<ExperienciaUIDDTO[]>(
			url,
			token
		);
		return response;
	} catch (error) {
		console.error("[adminService.getUIDs] Error al obtener UIDs", {
			experienciaId,
			hasToken: !!token,
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
};

/**
 * Obtiene el QR code de un UID
 * @param uidId ID del UID
 * @param token Token de autenticación
 * @returns QR code
 */
const getQRCode = async (
	uidId: string,
	token: string
): Promise<QRCodeResponse> => {
	try {
		const url = `/api/experiencias/uids/${uidId}/qr`;
		const response = await apiClient.getWithToken<QRCodeResponse>(
			url,
			token
		);
		return response;
	} catch (error) {
		console.error("[adminService.getQRCode] Error al obtener QR code", {
			uidId,
			hasToken: !!token,
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
};

export const adminService = {
	createUser,
	updateUser,
	deleteUser,
	getUserByEmail,
	isAdmin,
	createExperiencia,
	updateExperiencia,
	deleteExperiencia,
	getAllExperiencesAdmin,
	generarUIDs,
	getUIDs,
	getQRCode,
};
