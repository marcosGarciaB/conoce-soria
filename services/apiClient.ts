/*
 * Centraliza toda la lógica de fetch, para no tener que repetirla.
 */

const API_URL = "http://192.168.1.133:8080";
//const API_URL = "http://localhost:8080";
//const API_URL = "https://soria-backend-production.up.railway.app";

/**
 * Define la estructura de las cabeceras HTTP.
 */
interface Headers {
	[Key: string]: string;
}

/**
 * Función genérica para realizar peticiones HTTP usando fetch.
 * @template T Tipo esperado en la respuesta
 * @param method Método HTTP: "GET", "POST", "PUT" o "DELETE"
 * @param endpoint Ruta del endpoint, relativa a `API_URL`
 * @param body Cuerpo de la petición (opcional)
 * @param token Token de autenticación (opcional)
 * @returns Respuesta del tipo `T`
 */
const request = async <T>(
	method: "GET" | "POST" | "PUT" | "DELETE",
	endpoint: string,
	body?: any,
	token?: string
): Promise<T> => {
	const headers: Headers = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const response = await fetch(`${API_URL}${endpoint}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});

	if (response.status === 204) return null as unknown as T;

	try {
		return (await response.json()) as T;
	} catch {
		return null as unknown as T;
	}
};

/**
 * Cliente HTTP centralizado con métodos para interactuar con la API.
 */
export const apiClient = {
	/**
	 * GET sin token
	 */
	get: <T>(endpoint: string) => 
		request<T>("GET", endpoint),

	/**
	 * POST sin token
	 */
	post: <T>(endpoint: string, body: any) =>
		request<T>("POST", endpoint, body),

	/**
	 * PUT sin token
	 */
	put: <T>(endpoint: string, body: any) => 
		request<T>("PUT", endpoint, body),

	/**
	 * DELETE sin token
	 */
	delete: <T>(endpoint: string) => 
		request<T>("DELETE", endpoint),

	/**
	 * POST con token
	 */
	postWithToken: <T>(endpoint: string, body: any, token: string) =>
		request<T>("POST", endpoint, body, token),

	/**
	 * GET con token
	 */
	getWithToken: <T>(endpoint: string, token: string) =>
		request<T>("GET", endpoint, undefined, token),

	/**
	 * PUT con token
	 */
	putWithToken: <T>(endpoint: string, body: any, token: string) =>
		request<T>("PUT", endpoint, body, token),

	/**
	 * DELETE con token
	 */
	deleteWithToken: <T>(endpoint: string, token: string) =>
		request<T>("DELETE", endpoint, undefined, token),
};
