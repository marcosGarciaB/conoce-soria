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
	logout: () => Promise<void>;
}

/**
 * Estado de autenticación.
 * @typedef {Object} AuthState
 * @property {"checking" | "authenticated" | "not-authenticated"} status - Estado actual de autenticación.
 * @property {string | null} token - Token del usuario, o `null` si no está autenticado.
 */

/**
 * Propiedades del contexto de autenticación.
 * @typedef {Object} AuthContextProps
 * @property {"checking" | "authenticated" | "not-authenticated"} status - Estado de autenticación.
 * @property {string | null} token - Token del usuario.
 * @property {(credentials: LoginCredentials) => Promise<void>} login - Función para iniciar sesión.
 * @property {() => Promise<void>} logout - Función para cerrar sesión.
 */

/**
 * Contexto de autenticación.
 * @type {React.Context<AuthContextProps>}
 */
export const AuthContext = createContext({} as AuthContextProps);

const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // 50 min
const TOKEN_STORAGE_KEY = "authToken";
const TOKEN_TIMESTAMP_KEY = "authTokenTimestamp";

/**
 * Proveedor de autenticación que envuelve la aplicación y provee
 * el contexto de Auth a los componentes hijos.
 *
 * - Maneja login / logout
 * - Guarda y restaura token desde AsyncStorage
 * - Renueva token automáticamente cada 50 minutos
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Componentes hijos que recibirán el contexto
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [authState, setAuthState] = useState<AuthState>({
		status: "checking",
		token: null,
	});

	const tokenRef = useRef<string | null>(null);
	const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
		null
	);

	const saveToken = async (token?: string | null) => {
		if (!token) {
			console.warn("[AuthContext] Token inválido, no se guarda");
			return;
		}

		await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
		await AsyncStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
	};

	const clearTokenRefresh = () => {
		if (refreshIntervalRef.current) {
			clearInterval(refreshIntervalRef.current);
			refreshIntervalRef.current = null;
			console.log("[AuthContext] Intervalo de renovación limpiado");
		}
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

			if (!response?.token) {
				throw new Error("Token inválido en refresh");
			}

			tokenRef.current = response.token;

			setAuthState({
				status: "authenticated",
				token: response.token,
			});

			await saveToken(response.token);

			console.log("[AuthContext] Token renovado correctamente");
		} catch (error) {
			console.error(
				"[AuthContext] Error al renovar token automáticamente:",
				error
			);
			await clearAuthState();
		}
	};

	const setupTokenRefresh = () => {
		clearTokenRefresh();

		refreshIntervalRef.current = setInterval(
			refreshTokenAutomatically,
			TOKEN_REFRESH_INTERVAL
		);

		console.log(
			`[AuthContext] Renovación automática cada ${
				TOKEN_REFRESH_INTERVAL / 60000
			} minutos`
		);
	};

	useEffect(() => {
		const restoreSession = async () => {
			try {
				const storedToken = await AsyncStorage.getItem(
					TOKEN_STORAGE_KEY
				);

				if (!storedToken) {
					setAuthState({
						status: "not-authenticated",
						token: null,
					});
					return;
				}

				tokenRef.current = storedToken;

				setAuthState({
					status: "authenticated",
					token: storedToken,
				});

				setupTokenRefresh();
			} catch (error) {
				console.error("[AuthContext] Error restaurando sesión:", error);

				setAuthState({
					status: "not-authenticated",
					token: null,
				});
			}
		};

		restoreSession();

		return () => {
			clearTokenRefresh();
		};
	}, []);

	const login = async (credentials: LoginCredentials) => {
		const response: AuthResponse = await authService.login(credentials);

		if (!response?.token) {
			throw new Error("Login sin token");
		}

		tokenRef.current = response.token;

		setAuthState({
			status: "authenticated",
			token: response.token,
		});

		await saveToken(response.token);

		setupTokenRefresh();
	};

	const logout = async () => {
		await clearAuthState();
	};

	const authContextValue = useMemo(
		() => ({
			status: authState.status,
			token: authState.token,
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

/**
 * Hook para acceder al contexto de autenticación.
 * @returns {AuthContextProps} Estado de autenticación y funciones login/logout
 * 
 * Inicia sesión del usuario.
 * @param {LoginCredentials} credentials - Credenciales del usuario
 * 
 * Cierra sesión del usuario y limpia estado/token
 * 
 * @example
 * const { status, token, login, logout } = useAuth();
 */
export const useAuth = () => {
	return useContext(AuthContext);
};
