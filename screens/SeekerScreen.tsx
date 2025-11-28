import Header from "@/components/common/HeaderItem";
import ExperienceCard from "@/components/seeker/ExperienceCard";
import Filters from "@/components/seeker/FilterDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { experienciaService, ExperienciasResponse } from "@/services/experienceService";

import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    LayoutAnimation,
    Platform,
    StyleSheet,
    UIManager
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const categories = ["RESTAURANTE", "MUSEO", "AIRE_LIBRE", "MONUMENTO"];

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const SearchScreen = ({ navigation }: { navigation: any }) => {
    const { status } = useAuth();
    const isLogged = status === "authenticated";

    const { data: experiencias, loadData: loadExperiencias, loading, hasMore } = usePaginatedFetch<ExperienciasResponse>({
        fetchFunction: experienciaService.getExperiencias,
        pageSize: 10,
    });

    const [searchText, setSearchText] = useState("");
    const [selectedCat, setSelectedCat] = useState<string | null>(null);
    const [filteredExperiencias, setFilteredExperiencias] = useState<ExperienciasResponse[]>([]);

    useEffect(() => {
        setFilteredExperiencias(experiencias);
    }, [experiencias]);

    const handlePressExperiencia = (experiencia: ExperienciasResponse) => {
        navigation.navigate(isLogged ? "Details" : "Login", { experiencia });
    };

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

    const renderItem = ({ item }: { item: ExperienciasResponse }) => (
        <ExperienceCard experiencia={item} onPress={handlePressExperiencia} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Explorar" icon="search-sharp" />

            <FlatList
                data={filteredExperiencias}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                numColumns={width > 600 ? 2 : 1}
                columnWrapperStyle={width > 600 ? { justifyContent: "space-between" } : undefined}
                contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 5 }}
                ListHeaderComponent={
                    <Filters
                        searchText={searchText}
                        setSearchText={setSearchText}
                        selectedCat={selectedCat}
                        setSelectedCat={setSelectedCat}
                        categories={categories}
                        onFilterByText={wordsFilter}
                        onFilterByCategory={buttonFilter}
                    />
                }
                onEndReached={() => loadExperiencias()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading ? <ActivityIndicator size="large" color="#333" style={{ margin: 20 }} /> : null
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
        padding: 5
    },
});

export default SearchScreen;
