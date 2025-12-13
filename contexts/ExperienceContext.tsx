import { adminService } from "@/services/adminService";
import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import {
	ExperienciaDetailResponse,
	experienciaService,
	ExperienciasResponse,
} from "../services/experienceService";
import { useAuth } from "./AuthContext";
import { useRefresh } from "./RefreshContext";

interface ExperienciaContextProps {
	experiencias: ExperienciasResponse[];
	experienciasDetalladas: ExperienciaDetailResponse[];
	loadExperiencias: (reset?: boolean) => Promise<void>;
	loadExperienciasDetalladas: (reset?: boolean) => Promise<void>;
	addExperiencia: (exp: ExperienciaDetailResponse) => void;
	updateExperiencia: (exp: ExperienciaDetailResponse) => void;
	deleteExperiencia: (id: number) => void;
	loading: boolean;
	loadingDetalladas: boolean;
	hasMore: boolean;
	hasMoreDetalladas: boolean;
	baseLoaded: boolean;
	detalladasLoaded: boolean;
}

export const ExperienciaContext = createContext({} as ExperienciaContextProps);

export const ExperienciaProvider = ({ children }: { children: ReactNode }) => {
	const { token } = useAuth();
	const { subscribeExperiencias } = useRefresh();

	// Estados locales para manipulación rápida (CRUD) y visualización
	const [experiencias, setExperiencias] = useState<ExperienciasResponse[]>(
		[]
	);
	const [experienciasDetalladas, setExperienciasDetalladas] = useState<
		ExperienciaDetailResponse[]
	>([]);

	// Control de carga inicial
	const [baseLoaded, setBaseLoaded] = useState(false);
	const [detalladasLoaded, setDetalladasLoaded] = useState(false);

	// -----------------------------------------------------------------------
	// 1. CARGA DE EXPERIENCIAS BASE (HOME/LISTAS PÚBLICAS)
	// -----------------------------------------------------------------------
	// experienciaService.getExperiencias es estática, no necesita useCallback
	const {
		data: experienciasBaseData,
		loadData: loadExperiencias,
		loading,
		hasMore,
	} = usePaginatedFetch<ExperienciasResponse>({
		fetchFunction: experienciaService.getExperiencias,
		pageSize: 30,
	});

	// -----------------------------------------------------------------------
	// 2. CARGA DE EXPERIENCIAS DETALLADAS (ADMIN)
	// -----------------------------------------------------------------------
	// SOLUCIÓN DEL ERROR: Memorizamos esta función dependiente del token
	const fetchAdminExperiences = useCallback(
		(page: number, pageSize: number) => {
			if (!token) return Promise.resolve([]); // Protección
			return adminService.getAllExperiencesAdmin(token, page, pageSize);
		},
		[token] // Solo se recrea si cambia el token
	);

	const {
		data: experienciasDetalladasData,
		loadData: loadExperienciasDetalladas,
		loading: loadingDetalladas,
		hasMore: hasMoreDetalladas,
	} = usePaginatedFetch<ExperienciaDetailResponse>({
		fetchFunction: fetchAdminExperiences,
		pageSize: 30,
	});

	// -----------------------------------------------------------------------
	// 3. SINCRONIZACIÓN (Hook -> Context State)
	// -----------------------------------------------------------------------

	// Sincroniza la lista base cuando el hook trae nuevos datos
	useEffect(() => {
		if (experienciasBaseData) {
			setExperiencias(experienciasBaseData);
			if (experienciasBaseData.length > 0) setBaseLoaded(true);
		}
	}, [experienciasBaseData]);

	// Sincroniza la lista detallada cuando el hook trae nuevos datos
	useEffect(() => {
		if (experienciasDetalladasData) {
			setExperienciasDetalladas(experienciasDetalladasData);
			if (experienciasDetalladasData.length > 0)
				setDetalladasLoaded(true);
		}
	}, [experienciasDetalladasData]);

	// -----------------------------------------------------------------------
	// 4. SUSCRIPCIÓN A EVENTOS DE REFRESH GLOBAL
	// -----------------------------------------------------------------------
	useEffect(() => {
		const unsubscribe = subscribeExperiencias(() => {
			console.log("Refreshing experiences...");
			// Recargamos ambas listas desde cero
			loadExperiencias(true);
			if (token) loadExperienciasDetalladas(true);
		});

		return unsubscribe;
	}, [
		subscribeExperiencias,
		loadExperiencias,
		loadExperienciasDetalladas,
		token,
	]);

	// -----------------------------------------------------------------------
	// 5. MÉTODOS DE ACTUALIZACIÓN OPTIMISTA (CRUD Local)
	// -----------------------------------------------------------------------

	const addExperiencia = (exp: ExperienciaDetailResponse) => {
		setExperienciasDetalladas((prev) => {
			if (prev.some((e) => e.id === exp.id)) return prev;
			return [exp, ...prev];
		});

		if (exp.activo) {
			setExperiencias((prev) => {
				if (prev.some((e) => e.id === exp.id)) return prev;
				return [
					{
						id: exp.id,
						titulo: exp.titulo,
						categoria: exp.categoria,
						imagenPortadaUrl: exp.imagenPortadaUrl,
					},
					...prev,
				];
			});
		}
	};

	const updateExperiencia = (exp: ExperienciaDetailResponse) => {
		setExperienciasDetalladas((prev) =>
			prev.map((e) => (e.id === exp.id ? exp : e))
		);

		setExperiencias((prev) => {
			const exists = prev.some((e) => e.id === exp.id);

			if (!exp.activo) {
				return prev.filter((e) => e.id !== exp.id);
			}

			if (exists) {
				return prev.map((e) =>
					e.id === exp.id
						? {
								id: exp.id,
								titulo: exp.titulo,
								categoria: exp.categoria,
								imagenPortadaUrl: exp.imagenPortadaUrl,
						  }
						: e
				);
			} else {
				return [
					{
						id: exp.id,
						titulo: exp.titulo,
						categoria: exp.categoria,
						imagenPortadaUrl: exp.imagenPortadaUrl,
					},
					...prev,
				];
			}
		});
	};

	const deleteExperiencia = (id: number) => {
		setExperienciasDetalladas((prev) => prev.filter((e) => e.id !== id));
		setExperiencias((prev) => prev.filter((e) => e.id !== id));
	};

	const value = useMemo(
		() => ({
			experiencias,
			experienciasDetalladas,
			loadExperiencias,
			loadExperienciasDetalladas,
			addExperiencia,
			updateExperiencia,
			deleteExperiencia,
			loading,
			loadingDetalladas,
			hasMore,
			hasMoreDetalladas,
			baseLoaded,
			detalladasLoaded,
		}),
		[
			experiencias,
			experienciasDetalladas,
			loading,
			loadingDetalladas,
			hasMore,
			hasMoreDetalladas,
			baseLoaded,
			detalladasLoaded,
			loadExperiencias,
			loadExperienciasDetalladas,
		]
	);

	return (
		<ExperienciaContext.Provider value={value}>
			{children}
		</ExperienciaContext.Provider>
	);
};

export const useExperiencias = () => useContext(ExperienciaContext);
