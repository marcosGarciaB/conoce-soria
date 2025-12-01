import { useExperiences } from "@/hooks/useLoadExperiences";
import { ExperienciasResponse } from "@/services/experienceService";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { LayoutAnimation } from "react-native";

export const useFilteredExperiences = () => {

	const categories = ["RESTAURANTE", "MUSEO", "AIRE_LIBRE", "MONUMENTO"];

	const { experiencias, loadExperiencias, loading, hasMore } =
		useExperiences();

	const [searchText, setSearchText] = useState("");
	const [selectedCat, setSelectedCat] = useState<string | null>(null);
	const [filteredExperiencias, setFilteredExperiencias] = useState<ExperienciasResponse[]>([]);

	useEffect(() => {
		setFilteredExperiencias(experiencias);
	}, [experiencias]);

	const applyFilters = (texto: string, category: string | null) => {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			const filtered = experiencias.filter(exp => {
				const matchCat = category ? exp.categoria.toUpperCase() === category.toUpperCase() : true;
				const matchText = exp.titulo.toLowerCase().includes(texto.toLowerCase());
				return matchCat && matchText;
			});
			setFilteredExperiencias(filtered);
		};
	
		const debouncedApplyFilters = useCallback(
			debounce((texto: string, category: string | null) => applyFilters(texto, category), 300),
			[experiencias]
		);
	
		const wordsFilter = (texto: string) => {
			setSearchText(texto);
			debouncedApplyFilters(texto, selectedCat);
		};
	
		const buttonFilter = (categoria: string) => {
			const newSelected = selectedCat === categoria ? null : categoria;
			setSelectedCat(newSelected);
			applyFilters(searchText, newSelected);
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
		categories
	};
};
