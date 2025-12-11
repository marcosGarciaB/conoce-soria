import { adminService } from "@/services/adminService";
import React, {
	createContext,
	ReactNode,
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
}

export const ExperienciaContext = createContext({} as ExperienciaContextProps);

export const ExperienciaProvider = ({ children }: { children: ReactNode }) => {
	const { token } = useAuth();
	const { subscribeExperiencias } = useRefresh();

	// Base
	const {
		data: experienciasBaseData,
		loadData: loadExperiencias,
		loading,
		hasMore,
	} = usePaginatedFetch<ExperienciasResponse>({
		fetchFunction: experienciaService.getExperiencias,
		pageSize: 5,
	});

	const [experiencias, setExperiencias] = useState<ExperienciasResponse[]>(
		[]
	);

	// Detalles
	const [experienciasDetalladas, setExperienciasDetalladas] = useState<
		ExperienciaDetailResponse[]
	>([]);

	const {
		data: experienciasDetalladasData,
		loadData: loadExperienciasDetalladas,
		loading: loadingDetalladas,
		hasMore: hasMoreDetalladas,
	} = usePaginatedFetch<ExperienciaDetailResponse>({
		fetchFunction: (offset, limit) =>
			adminService.getAllExperiencesAdmin(token!, offset, limit),
		pageSize: 5,
	});

	// Sincroniza lista base
	useEffect(() => {
		if (experienciasBaseData) {
			setExperiencias(experienciasBaseData);
		}
	}, [experienciasBaseData]);

	// Sincroniza lista detallada
	useEffect(() => {
		if (experienciasDetalladasData) {
			setExperienciasDetalladas(experienciasDetalladasData);
		}
	}, [experienciasDetalladasData]);

	// Funciones
	const addExperiencia = (exp: ExperienciaDetailResponse) => {
		setExperienciasDetalladas((prev) => {
			if (prev.some((e) => e.id === exp.id)) return prev;
			return [...prev, exp];
		});

		if (exp.activo) {
			setExperiencias((prev) => {
				if (prev.some((e) => e.id === exp.id)) return prev;
				return [
					...prev,
					{
						id: exp.id,
						titulo: exp.titulo,
						categoria: exp.categoria,
						imagenPortadaUrl: exp.imagenPortadaUrl,
					},
				];
			});
		}
	};

	const updateExperiencia = (exp: ExperienciaDetailResponse) => {
		setExperienciasDetalladas((prev) =>
			prev.map((e) => (e.id === exp.id ? exp : e))
		);

		if (exp.activo) {
			setExperiencias((prev) => {
				const exists = prev.some((e) => e.id === exp.id);

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
						...prev,
						{
							id: exp.id,
							titulo: exp.titulo,
							categoria: exp.categoria,
							imagenPortadaUrl: exp.imagenPortadaUrl,
						},
					];
				}
			});
		} else {
			setExperiencias((prev) => prev.filter((e) => e.id !== exp.id));
		}
	};

	const deleteExperiencia = (id: number) => {
		setExperienciasDetalladas((prev) => prev.filter((e) => e.id !== id));
		setExperiencias((prev) => prev.filter((e) => e.id !== id));
	};

	useEffect(() => {
		const unsubscribe = subscribeExperiencias(() => {
			loadExperiencias(true);
			loadExperienciasDetalladas(true);
		});

		return unsubscribe;
	}, [subscribeExperiencias, loadExperiencias, loadExperienciasDetalladas]);

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
		}),
		[
			experiencias,
			experienciasDetalladas,
			loadExperiencias,
			loadExperienciasDetalladas,
			loading,
			loadingDetalladas,
			hasMore,
			hasMoreDetalladas,
		]
	);

	return (
		<ExperienciaContext.Provider value={value}>
			{children}
		</ExperienciaContext.Provider>
	);
};

export const useExperiencias = () => useContext(ExperienciaContext);
