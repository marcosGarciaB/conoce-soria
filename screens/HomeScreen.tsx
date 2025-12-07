import Header from "@/components/common/HeaderItem";
import LoadingScreen from "@/components/common/Loading";
import TitleHeader from "@/components/common/TitleHeader";
import FlatListAnimated from "@/components/home/FlatListAnimated";
import Information from "@/components/home/Information";
import MiniPassport from "@/components/home/MiniPassport";
import Ranking from "@/components/top/Ranking";
import { useAuth } from "@/contexts/AuthContext";
import { useLoadTop } from "@/hooks/useLoadTop";
import { passportService } from "@/services/passportService";

import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const InicioScreen = ({ navigation }: { navigation: any }) => {

    const { status, logout, token } = useAuth();
    const isLogged = status === "authenticated";
    const { topUsuarios } = useLoadTop();

    // 🔥 Estado propio para el pasaporte actualizado
    const [passport, setPassport] = useState(null);

    // 🔥 Recargar si la pantalla vuelve con refresh=true
    const route = useRoute();
    const shouldRefresh = (route.params as any)?.refresh === true;

    useFocusEffect(
        useCallback(() => {
            const loadPassport = async () => {
                if (!isLogged || !token) return;

                try {
                    const data = await passportService.getPasaporte(token);
                    setPassport(data);
                } catch (err) {
                    console.log("Error cargando pasaporte:", err);
                }
            };

            loadPassport();
        }, [isLogged, token, shouldRefresh])
    );

    if (status === "checking") return <LoadingScreen />;

    return (
        <SafeAreaView style={styles.container}>

            {isLogged ? (
                <Header
                    title="Conoce Soria"
                    icon="home-outline"
                    isSecondIcon={true}
                    icon2="log-out-outline"
                    onPress={logout}
                />
            ) : (
                <Header title="Conoce Soria" icon="person-circle" />
            )}

            <ScrollView
                contentContainerStyle={{ paddingBottom: 50, paddingTop: 70 }}
                showsVerticalScrollIndicator={false}
            >
                <Information />
                <FlatListAnimated />

                {isLogged ? (
                    <MiniPassport navigation={navigation} passport={passport} />
                ) : (
                    <Ranking
                        topUsuarios={topUsuarios}
                        navigation={navigation}
                        isHome={true}
                    />
                )}

                <TitleHeader title="Mapa" />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});

export default InicioScreen;
