import Header from "@/components/common/HeaderItem";
import DetailFlatListAnimated from "@/components/seeker/DetailFlatListAnimated";
import { useAuth } from "@/contexts/AuthContext";
import { ExperienciasResponse } from "@/services/experienceService";

import React from "react";
import {
    Platform,
    StyleSheet,
    UIManager
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const SearchScreen = ({ navigation }: { navigation: any }) => {
    const { status } = useAuth();
    const isLogged = status === "authenticated";

    const handlePressExperiencia = (experiencia: ExperienciasResponse) => {
        navigation.navigate(isLogged ? "Details" : "Login", { experiencia });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Explorar" icon="search-sharp" />
            <DetailFlatListAnimated onPress={handlePressExperiencia} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default SearchScreen;
