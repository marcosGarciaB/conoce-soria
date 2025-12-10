import { adminService } from "@/services/adminService";
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import { ExperienciaDetailResponse, experienciaService, ExperienciasResponse } from "../services/experienceService";
import { useAuth } from "./AuthContext";

interface ExperienciaContextProps {
	experiencias: ExperienciasResponse[]; // lista básica
	experienciasDetalladas: ExperienciaDetailResponse[]; // lista detallada
	loadExperiencias: (reset?: boolean) => Promise<void>;
	loadExperienciasDetalladas: (reset?: boolean) => Promise<void>;
	addExperiencia: (experiencia: ExperienciaDetailResponse) => void;
	updateExperiencia: (experiencia: ExperienciaDetailResponse) => void;
	deleteExperiencia: (id: number) => void;
	loading: boolean;
	loadingDetalladas: boolean;
	hasMore: boolean;
	hasMoreDetalladas: boolean;
}

export const ExperienciaContext = createContext({} as ExperienciaContextProps);

export const ExperienciaProvider = ({ children }: { children: ReactNode }) => {
	const { token } = useAuth();

	// Lista básica
	const { data: experienciasBase, loadData: loadExperiencias, loading, hasMore } =
		usePaginatedFetch<ExperienciasResponse>({
			fetchFunction: experienciaService.getExperiencias,
			pageSize: 5,
		});

	// Lista detallada
	const [experienciasDetalladas, setExperienciasDetalladas] = useState<ExperienciaDetailResponse[]>([]);

	const { data: experienciasDetalladasData, loadData: loadExperienciasDetalladas, loading: loadingDetalladas, hasMore: hasMoreDetalladas } =
		usePaginatedFetch<ExperienciaDetailResponse>({
			fetchFunction: (offset, limit) => adminService.getAllExperiencesAdmin(token!, offset, limit),
			pageSize: 5,
		});

	// Sincroniza datos de paginación
	React.useEffect(() => {
		if (experienciasDetalladasData) setExperienciasDetalladas(experienciasDetalladasData);
	}, [experienciasDetalladasData]);

	const addExperiencia = (exp: ExperienciaDetailResponse) => {
		// Añadir a detalladas
		setExperienciasDetalladas(prev => {
			if (!prev.find(e => e.id === exp.id)) return [...prev, exp];
			return prev;
		});
		// Añadir a básicas
		if (exp.activo && !experienciasBase.find(e => e.id === exp.id)) {
			experienciasBase.push({
				id: exp.id,
				categoria: exp.categoria,
				imagenPortadaUrl: exp.imagenPortadaUrl,
				titulo: exp.titulo,
			});
		}
	};

	// Actualizamos updateExperiencia y deleteExperiencia
	const updateExperiencia = (exp: ExperienciaDetailResponse) => {
		// Actualiza detalladas (admin)
		setExperienciasDetalladas(prev => {
			const index = prev.findIndex(e => e.id === exp.id);
			if (index >= 0) {
				const updated = [...prev];
				updated[index] = exp;
				return updated;
			}
			return [...prev, exp];
		});

		// Actualiza básicas (solo activas)
		const indexBase = experienciasBase.findIndex(e => e.id === exp.id);
		if (exp.activo) {
			if (indexBase >= 0) {
				experienciasBase[indexBase] = {
					id: exp.id,
					categoria: exp.categoria,
					imagenPortadaUrl: exp.imagenPortadaUrl,
					titulo: exp.titulo,
				};
			} else {
				experienciasBase.push({
					id: exp.id,
					categoria: exp.categoria,
					imagenPortadaUrl: exp.imagenPortadaUrl,
					titulo: exp.titulo,
				});
			}
		} else {
			if (indexBase >= 0) experienciasBase.splice(indexBase, 1);
		}
	};

const deleteExperiencia = (id: number) => {
	// Para admin: eliminamos de detalladas
	setExperienciasDetalladas(prev => prev.filter(e => e.id !== id));
	// Para lista básica: eliminar si existía
	const indexBase = experienciasBase.findIndex(e => e.id === id);
	if (indexBase >= 0) experienciasBase.splice(indexBase, 1);
};

const value = useMemo(() => ({
	experiencias: experienciasBase,
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
}), [
	experienciasBase,
	experienciasDetalladas,
	loadExperiencias,
	loadExperienciasDetalladas,
	loading,
	loadingDetalladas,
	hasMore,
	hasMoreDetalladas,
]);

useEffect(() => {
	loadExperiencias(true);
	loadExperienciasDetalladas(true);
}, []);

return (
	<ExperienciaContext.Provider value={value}>
		{children}
	</ExperienciaContext.Provider>
);
};

export const useExperiencias = () => useContext(ExperienciaContext);
