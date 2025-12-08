/*
 * - Centralizamos el token y user + login/logout + restaurar sesión.
 * - Cualquier componente puede leer el estado sin pasar props.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    AuthResponse,
    authService,
    LoginCredentials,
} from "../services/authService";

interface AuthState {
	status: "checking" | "authenticated" | "not-authenticated";
	token: string | null;
}

interface AuthContextProps {
	status: "checking" | "authenticated" | "not-authenticated";
	token: string | null;
	login: (credentials: LoginCredentials) => Promise<void>;
	logout: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000;
const TOKEN_STORAGE_KEY = "authToken";
const TOKEN_TIMESTAMP_KEY = "authTokenTimestamp";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [authState, setAuthState] = useState<AuthState>({
		status: "checking",
		token: null,
	});
	const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
		null
	);
	const tokenRef = useRef<string | null>(null);

	const saveToken = async (token: string) => {
		await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
		await AsyncStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
	};

	const clearAuthState = async () => {
		clearTokenRefresh();
		tokenRef.current = null;
		await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
		await AsyncStorage.removeItem(TOKEN_TIMESTAMP_KEY);
		setAuthState({
			status: "not-authenticated",
			token: null,
		});
	};

	const refreshTokenAutomatically = async () => {
		const currentToken = tokenRef.current;
		if (!currentToken) {
			console.warn("[AuthContext] No hay token para renovar");
			return;
		}

		try {
			console.log("[AuthContext] Renovando token automáticamente...");
			const response: AuthResponse = await authService.refreshToken(
				currentToken
			);
			tokenRef.current = response.token;
			setAuthState({
				status: "authenticated",
				token: response.token,
			});
			await saveToken(response.token);
			console.log("[AuthContext] Token renovado exitosamente");
		} catch (error) {
			console.error(
				"[AuthContext] Error al renovar el token automáticamente:",
				error
			);
			await clearAuthState();
		}
	};

	const setupTokenRefresh = () => {
		if (refreshIntervalRef.current) {
			clearInterval(refreshIntervalRef.current);
		}

		refreshIntervalRef.current = setInterval(() => {
			refreshTokenAutomatically();
		}, TOKEN_REFRESH_INTERVAL);

		console.log(
			`[AuthContext] Intervalo de renovación configurado: cada ${
				TOKEN_REFRESH_INTERVAL / 60000
			} minutos`
		);
	};

	const clearTokenRefresh = () => {
		if (refreshIntervalRef.current) {
			clearInterval(refreshIntervalRef.current);
			refreshIntervalRef.current = null;
			console.log("[AuthContext] Intervalo de renovación limpiado");
		}
	};

	useEffect(() => {
		const checkToken = async () => {
			try {
				const tokenFromStorage = await AsyncStorage.getItem(
					TOKEN_STORAGE_KEY
				);

				if (!tokenFromStorage) {
					setAuthState({
						status: "not-authenticated",
						token: null,
					});
					return;
				}

				tokenRef.current = tokenFromStorage;
				setAuthState({
					status: "authenticated",
					token: tokenFromStorage,
				});

				setupTokenRefresh();
			} catch (error) {
				console.error("Error al comprobar el token:", error);
				setAuthState({
					status: "not-authenticated",
					token: null,
				});
			}
		};
		checkToken();

		return () => {
			clearTokenRefresh();
		};
	}, []);

	const login = async (credentials: LoginCredentials) => {
		try {
			const response: AuthResponse = await authService.login(credentials);
			tokenRef.current = response.token;
			setAuthState({
				status: "authenticated",
				token: response.token,
			});
			await saveToken(response.token);

			setupTokenRefresh();
		} catch (error) {
			console.error("Error al comprobar el token:", error);
			throw error;
		}
	};

	const logout = async () => {
		await clearAuthState();
	};

	const authContextValue = useMemo(
		() => ({
			...authState,
			login,
			logout,
		}),
		[authState]
	);

	return (
		<AuthContext.Provider value={authContextValue}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
