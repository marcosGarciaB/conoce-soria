import {
	experienciaService,
	ExperienciasResponse
} from "@/services/experienceService";
import { useEffect } from "react";
import { usePaginatedFetch } from "./usePaginatedFetch";

export const useLoadExperiences = (pageSize: number = 5) => {

	const {
		data: experiencias,
		loadData: loadExperiencias,
		loading,
		hasMore,
	} = usePaginatedFetch<ExperienciasResponse>({
		fetchFunction: experienciaService.getExperiencias,
		pageSize,
	});

	useEffect(() => {
		loadExperiencias(true);
	}, []);

	return {
		experiencias,
		loadExperiencias,
		loading,
		hasMore,
	};
};
