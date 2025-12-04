import {
	ExperienciaDetailResponse,
	experienciaService,
	ExperienciasResponse,
} from "@/services/experienceService";
import { useEffect, useState } from "react";

export const useLoadMarkers = () => {
	const [experienciasMarkers, setExperienciasMarkers] = useState<ExperienciasResponse[]>([]);
	const [detail, setDetail] = useState<ExperienciaDetailResponse[]>([]);
    const [loading, setLoading] = useState(true);

	const loadExperience = async() => {
		try {
			const experiencias = await experienciaService.getExperiencias(0, 30);
			setExperienciasMarkers(experiencias);

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
        experienciasMarkers,
        detail,
        loading,
    };
};
