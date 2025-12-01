import { useExperiences } from "@/hooks/useLoadExperiences";
import { ExperienciasResponse } from "@/services/experienceService";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { LayoutAnimation } from "react-native";

export const useFilteredExperiences = () => {
	const categories = ["RESTAURANTE", "MUSEO", "AIRE_LIBRE", "MONUMENTO"];
	const { experiencias, loadExperiencias, loading, hasMore } = useExperiences();

	const [searchText, setSearchText] = useState("");
	const [selectedCat, setSelectedCat] = useState<string | null>(null);
	const [filteredExperiencias, setFilteredExperiencias] = useState<ExperienciasResponse[]>([]);

	const applyFilters = useCallback((texto: string, categoria: string | null) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

		const filtered = experiencias.filter(exp => {
			const matchCat = categoria ? exp.categoria.toUpperCase() === categoria.toUpperCase() : true;
			const matchText = exp.titulo.toLowerCase().includes(texto.toLowerCase());
			return matchCat && matchText;
		});

		setFilteredExperiencias(filtered);
	}, [experiencias]);

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
	};
};
