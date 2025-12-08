import { useLoadExperiences } from "@/hooks/useLoadExperiences";
import { ExperienciaDetailResponse, ExperienciasResponse } from "@/services/experienceService";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { LayoutAnimation } from "react-native";
import { useLoadMarkers } from "./useLoadMarkers";

/**
 * Hook para gestionar experiencias filtradas según texto de búsqueda y categoría seleccionada.
 *
 * Este hook:
 * - Obtiene las experiencias paginadas desde `useLoadExperiences`.
 * - Obtiene el detalle de marcadores desde `useLoadMarkers`.
 * - Aplica filtros por texto y por categoría.
 * - Evita repeticiones de elementos mediante `Map`.
 * - Anima la transición visual usando `LayoutAnimation`.
 * - Usa `debounce` para mejorar el rendimiento al filtrar texto.
 *
 * Funcionalidad del filtrado:
 * - `wordsFilter` actualiza el texto de búsqueda.
 * - `buttonFilter` alterna la categoría seleccionada.
 * - `applyFilters` ejecuta el filtrado real.
 *
 * @returns {object} Objeto con las experiencias filtradas, estado de carga y filtros activos.
 */
export const useFilteredExperiences = () => {
	const categories = ["RESTAURANTE", "MUSEO", "AIRE_LIBRE", "MONUMENTO"];
	const [searchText, setSearchText] = useState("");
	const [selectedCat, setSelectedCat] = useState<string | null>(null);
	
	const { experiencias, loadExperiencias, loading, hasMore } = useLoadExperiences();
	const [filteredExperiencias, setFilteredExperiencias] = useState<ExperienciasResponse[]>([]);
	
	const { detail, loading: loadingMarker } = useLoadMarkers();
	const [filteredMarkers, setFilteredMarkers] = useState<ExperienciaDetailResponse[]>([]);


	const applyFilters = useCallback((texto: string, categoria: string | null) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

		const filtered = experiencias.filter(exp => {
			const matchCat = categoria ? exp.categoria.toUpperCase() === categoria.toUpperCase() : true;
			const matchText = exp.titulo.toLowerCase().includes(texto.toLowerCase());
			return matchCat && matchText;
		});

		const filteredDetail = detail.filter(exp => {
			const matchCat = categoria ? exp.categoria.toUpperCase() === categoria.toUpperCase() : true;
			return matchCat;
		});


		const uniqueFiltered = Array.from(new Map(filtered.map(item => [item.id, item])).values());
		const uniqueFilteredDetail = Array.from(new Map(filteredDetail.map(item => [item.id, item])).values());

		setFilteredExperiencias(uniqueFiltered);
		setFilteredMarkers(uniqueFilteredDetail);
	}, [experiencias, detail]);

	const debouncedApplyFilters = useCallback(
		debounce((texto: string, categoria: string | null) => applyFilters(texto, categoria), 250),
		[applyFilters]
	);

	useEffect(() => {
		debouncedApplyFilters(searchText, selectedCat);
	}, [searchText, selectedCat, debouncedApplyFilters]);

	const wordsFilter = (texto: string) => {
		setSearchText(texto);
	};

	const buttonFilter = (categoria: string) => {
		const newSelected = selectedCat === categoria ? null : categoria;
		setSelectedCat(newSelected);
	};

	return {
		experienciasFiltradas: filteredExperiencias,
		searchText,
		selectedCat,
		setSearchText,
		setSelectedCat,
		loadMore: loadExperiencias,
		buttonFilter,
		wordsFilter,
		loading,
		hasMore,
		categories,
		filteredMarkers,
	};
};
