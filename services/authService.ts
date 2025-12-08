/*
 * Aquí se definen los tipos y funciones relacionadas con los usuarios.
 */

import { apiClient } from "./apiClient";

/**
 * Respuesta de autenticación con token.
 */
export interface AuthResponse {
	token: string;
}

/**
 * Credenciales para iniciar sesión.
 */
export interface LoginCredentials {
	email: string;
	password: string;
}

/**
 * Credenciales para registrar un nuevo usuario.
 */
export interface RegisterCredentials {
	nombre: string;
	email: string;
	password: string;
}

/**
 * Datos completos de un usuario.
 */
export interface UserCredentials {
	id: number;
	nombre: string;
	email: string;
	password: string;
	role: string;
	puntos: string;
	fechaCreacion?: string;
	fotoPerfilUrl?: string;
	activo?: boolean;
}

/**
 * Datos que pueden actualizarse de un usuario.
 */
export interface UpdateCredentials {
	nombre?: string;
	email?: string;
	password?: string;
}

/**
 * Actualización de foto de perfil.
 */
export interface UpdateProfilePhoto {
	fotoPerfilUrl: string;
}

/**
 * Inicia sesión con email y contraseña.
 * @param credentials Credenciales de login
 * @returns Promise con el token de autenticación
 */
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
	try {
		const response = await apiClient.post<AuthResponse>(
			"/api/auth/login",
			credentials
		);
		return response;
	} catch (error) {
		throw error;
	}
};

/**
 * Registra un nuevo usuario.
 * @param credentials Datos del nuevo usuario
 */
const register = async (credentials: RegisterCredentials): Promise<void> => {
	try {
		await apiClient.post<void>("/api/auth/register", credentials);
	} catch (error) {
		throw error;
	}
};

/**
 * Obtiene los datos del usuario actual según token.
 * @param token Token de autenticación
 * @returns Datos del usuario
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
 * Actualiza los datos del usuario actual.
 * @param token Token de autenticación
 * @param credentials Datos a actualizar
 * @returns Datos actualizados del usuario
 */
const updateUserData = async (
	token: string,
	credentials: UpdateCredentials
): Promise<UserCredentials> => {
	try {
		const response = await apiClient.putWithToken<UserCredentials>(
			"/api/auth/me",
			credentials,
			token
		);
		return response;
	} catch (error) {
		throw error;
	}
};

/**
 * Obtiene todos los usuarios con paginación.
 * @param token Token de autenticación
 * @param offset Desplazamiento para paginación (por defecto 0)
 * @param limit Número máximo de usuarios a retornar (por defecto 5)
 * @returns Lista de usuarios
 */
const getAllUsers = async (
	token: string,
	offset = 0,
	limit = 5
): Promise<UserCredentials[]> => {
	try {
		const url = `/api/users?offset=${offset}&limit=${limit}`;
		const response = await apiClient.getWithToken<UserCredentials[]>(
			url,
			token
		);
		return response;
	} catch (error) {
		throw error;
	}
};

/**
 * Comprueba si un email ya existe.
 * @param email Email a verificar
 * @returns `true` si el email ya existe, `false` en caso contrario
 */
const emailExists = async (email: string): Promise<Boolean> => {
	try {
		const url = `/api/auth/check-email?email=${encodeURIComponent(email)}`;
		const response = await apiClient.get<{ exists: boolean }>(url);
		return response.exists;
	} catch (error) {
		throw error;
	}
};

/**
 * Cambia la foto de perfil del usuario actual.
 * @param token Token de autenticación
 * @param fotoPerfilUrl URL de la nueva foto de perfil
 * @returns Datos actualizados del usuario
 */
const changeProfilePhoto = async (
	token: string,
	fotoPerfilUrl: string
): Promise<UserCredentials> => {
	try {
		const response = await apiClient.putWithToken<UserCredentials>(
			"/api/auth/me/foto-perfil",
			{ fotoPerfilUrl },
			token
		);
		return response;
	} catch (error) {
		throw error;
	}
};

/**
 * Renueva el token de autenticación.
 * @param token Token actual
 * @returns Nuevo token de autenticación
 */
const refreshToken = async (token: string): Promise<AuthResponse> => {
	try {
		const response = await apiClient.getWithToken<AuthResponse>(
			"/api/auth/refresh",
			token
		);
		return response;
	} catch (error) {
		console.error("[authService.refreshToken] Error al renovar el token", {
			hasToken: !!token,
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
};

export const authService = {
	login,
	register,
	getUserData,
	updateUserData,
	getAllUsers,
	emailExists,
	changeProfilePhoto,
	refreshToken,
};
