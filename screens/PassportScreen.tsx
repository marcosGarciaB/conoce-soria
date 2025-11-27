import { topService } from "@/services/topService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { passportService } from "../services/passportService";

const PassportScreen = () => {

    const { token } = useAuth();
    const navigation = useNavigation<any>();

    const [registros, setRegistros] = useState<any[]>([]);
    const [totalPuntos, setTotalPuntos] = useState(0);
    const [ranking, setRanking] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPassport = async () => {
            if (!token) return;

            try {
                const data = await passportService.getPasaporte(token);
                const filtrado = data.registros.filter((r: any) => r.puntosOtorgados > 0);

                setRegistros(filtrado);
                setTotalPuntos(Number(data.puntosTotales ?? 0));

                const user = await authService.getUserData(token);
                const top = await topService.getRankingData();

                const pos = top.findIndex(
                    (u: any) => u.nombre === user.nombre || u.email === user.email
                );

                setRanking(pos >= 0 ? pos + 1 : null);

            } catch (err) {
                console.log("Error cargando pasaporte:", err);
            } finally {
                setLoading(false);
            }
        };

        loadPassport();
    }, [token]);

    if (loading) return <Text style={{ padding: 20 }}>Cargando...</Text>;

    return (
        <ScrollView style={styles.container}>

            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="#777" />
                </TouchableOpacity>

                <Text style={styles.topBarTitle}>Pasaporte</Text>

                <Ionicons name="location-outline" size={26} color="#777" />
            </View>

            <View style={styles.headerCard}>
                <Text style={styles.pointsValue}>{totalPuntos}</Text>

                {ranking !== null && (
                    <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>Puesto #{ranking}</Text>
                    </View>
                )}
            </View>

            <Text style={styles.sectionTitle}>Historial de experiencias</Text>

            {registros.map((reg, index) => (
                <View key={index} style={styles.card}>
                    <Image
                        source={{ uri: reg.imagen ?? "https://picsum.photos/200" }}
                        style={styles.cardImage}
                    />

                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{reg.titulo}</Text>
                        <Text style={styles.cardDate}>
                            {new Date(reg.fechaRegistro).toLocaleDateString("es-ES")}
                        </Text>
                    </View>

                    <View style={styles.pointsBadgeItem}>
                        <Text style={styles.pointsAmount}>+{reg.puntosOtorgados}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

export default PassportScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#faf7f2"
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 30,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
    },
    topBarTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF6B00",
    },
    headerCard: {
        backgroundColor: "white",
        padding: 22,
        borderRadius: 20,
        marginBottom: 30,
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        elevation: 3
    },
    pointsValue: {
        fontSize: 42,
        fontWeight: "900",
        color: "#000"
    },
    rankBadge: {
        marginTop: 12,
        backgroundColor: "#5fbf66",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 10
    },
    rankText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold"
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 14
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 14,
        borderRadius: 15,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2
    },
    cardImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: "#eee"
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333"
    },
    cardDate: {
        fontSize: 13,
        color: "#999",
        marginTop: 2
    },
    pointsBadgeItem: {
        backgroundColor: "#eef0f1",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 10
    },
    pointsAmount: {
        fontSize: 14,
        fontWeight: "bold"
    }
});
