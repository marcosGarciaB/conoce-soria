/*
 * Centraliza toda la lógica de fetch, para no tener que repetirla.
 */

//const API_URL = "https://soria-backend-production.up.railway.app";

const API_URL = "http://192.168.1.80:8080";
//const API_URL = "http://localhost:8080";
//const API_URL = "https://soria-backend-production.up.railway.app";

// Define la estructura de las cabeceras HTTP.
interface Headers {
	[Key: string]: string;
}

// Función genérica para las peticiones fetch.
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

export const apiClient = {
	get: <T>(endpoint: string) => 
		request<T>("GET", endpoint),

	post: <T>(endpoint: string, body: any) =>
		request<T>("POST", endpoint, body),

	put: <T>(endpoint: string, body: any) => 
		request<T>("PUT", endpoint, body),

	delete: <T>(endpoint: string) => 
		request<T>("DELETE", endpoint),

	postWithToken: <T>(endpoint: string, body: any, token: string) =>
		request<T>("POST", endpoint, body, token),

	getWithToken: <T>(endpoint: string, token: string) =>
		request<T>("GET", endpoint, undefined, token),

	putWithToken: <T>(endpoint: string, body: any, token: string) =>
		request<T>("PUT", endpoint, body, token),

	deleteWithToken: <T>(endpoint: string, token: string) =>
		request<T>("DELETE", endpoint, undefined, token),
};
