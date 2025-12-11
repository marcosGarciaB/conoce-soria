import { useExperiencias } from "@/contexts/ExperienceContext";
import {
	ExperienciaDetailResponse,
	experienciaService
} from "@/services/experienceService";
import { useEffect, useState } from "react";

/**
 * Hook para cargar experiencias y sus detalles para marcadores (por ejemplo, en un mapa).
 *
 * Este hook:
 * - Obtiene una lista de experiencias desde `experienciaService.getExperiencias`.
 * - Para cada experiencia, obtiene su detalle completo usando `experienciaService.getExperiencia`.
 * - Maneja automáticamente el estado de carga (`loading`).
 * - Expone tanto la lista general de experiencias como el detalle de cada una.
 *
 * Comportamiento:
 * - Carga inicial al montarse el hook.
 * - En caso de error durante la carga, lo registra en consola pero no interrumpe la aplicación.
 *
 * @returns {object} Contiene experiencias, detalles y estado de carga.
 * @property {ExperienciasResponse[]} experienciasMarkers - Lista de experiencias básicas.
 * @property {ExperienciaDetailResponse[]} detail - Lista de detalles completos de cada experiencia.
 * @property {boolean} loading - Indica si la carga de experiencias y detalles está en curso.
 */
export const useLoadMarkers = () => {
	//const [experienciasMarkers, setExperienciasMarkers] = useState<ExperienciasResponse[]>([]);
	const { experiencias } = useExperiencias();
	const [detail, setDetail] = useState<ExperienciaDetailResponse[]>([]);
    const [loading, setLoading] = useState(true);

	const loadExperience = async() => {
		try {
			//console.log("Experiencias MARKERS ", experiencias);
			const detailed = await Promise.all(experiencias.map(exp => experienciaService.getExperiencia(exp.id)));
            setDetail(detailed);

		} catch (error) {
			console.error(error)
		} finally {
            setLoading(false);
        }
	}

	useEffect(() => {
		loadExperience();
	}, []);

	return {
        //experienciasMarkers,
        detail,
        loading,
    };
};
