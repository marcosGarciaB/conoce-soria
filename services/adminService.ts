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

export interface NewUser {
	nombre: string;
	email: string;
	password: string;
	role: string;
	fotoPerfilUrl: string;
}
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
export interface ExperienciaUIDDTO {
	id: string;
	uid: string;
	activo: boolean;
	fechaGeneracion: string;
}

export interface UIDResponse {
	experienciaId: string;
	cantidadGenerados: number;
	uids: string[];
}

export interface QRCodeResponse {
	qrCode: string;
}

// Sección usuarios
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

const deleteUser = async (id: number, token: string): Promise<void> => {
	try {
		await apiClient.deleteWithToken(`/api/users/${id}`, token);
	} catch (error) {
		throw error;
	}
};

const isAdmin = async (token: string): Promise<boolean> => {
	try {
		const user = await getUserData(token);
		return user.role === "ADMIN";
	} catch (error) {
		return false;
	}
};

// Sección experiencias
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
