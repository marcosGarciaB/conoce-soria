import React, { useEffect, useState, useRef } from "react";
import { 
    View, Text, Animated, TouchableOpacity, Image, StyleSheet, ScrollView 
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { passportService, PasaporteDTO } from "../services/passportService";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";



const PassportScreen = () => {
    const { token } = useAuth();
    const navigation = useNavigation<any>();
    const [pasaporte, setPasaporte] = useState<PasaporteDTO | null>(null);

    const pointsAnim = useRef(new Animated.Value(0)).current;
    console.log("TOKEN DESDE useAuth():", token);


    useEffect(() => {
        const load = async () => {
            if (!token) return;

            try {
                const data = await passportService.getPasaporte(token);
                
                console.log("TOKEN:", token);


                // 🔥 FILTRAMOS SOLO EXPERIENCIAS REGISTRADAS
                const registrosFiltrados = data.registros.filter(r => r.puntosOtorgados > 0);

                setPasaporte({
                    ...data,
                    registros: registrosFiltrados
                });

                Animated.timing(pointsAnim, {
                    toValue: data.puntosTotales,
                    duration: 800,
                    useNativeDriver: false
                }).start();

            } catch (error) {
                console.log("Error cargando pasaporte:", error);
            }
        };

        load();
    }, [token]);

        useEffect(() => {
            const check = async () => {
                const stored = await AsyncStorage.getItem("authToken");
                console.log("TOKEN STORAGE QUIERO VER MI LOG:", stored);
                const { token } = useAuth();
console.log("TOKEN DESDE CONTEXT:", token);

            };
            check();
        }, []);



    if (!pasaporte) {
        return <Text style={{ padding: 20 }}>Cargando...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            
            <Text style={styles.title}>Tu Pasaporte</Text>

            <View style={styles.pointsBox}>
                <Text style={styles.pointsLabel}>Puntos totales</Text>
                <Animated.Text style={styles.pointsValue}>
                    {pointsAnim.interpolate({
                        inputRange: [0, pasaporte.puntosTotales],
                        outputRange: [0, pasaporte.puntosTotales]
                    }).toString()}
                </Animated.Text>
            </View>

            <Text style={styles.subtitle}>Tus experiencias completadas:</Text>

            {pasaporte.registros.map((reg, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.card}
                    onPress={() =>
                        navigation.navigate("ExperienceDetailsScreen", {
                            experienciaId: reg.experienciaId
                        })
                    }
                >
                    <Image 
                        source={{ uri: "https://picsum.photos/200" }}
                        style={styles.cardImage}
                    />

                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{reg.titulo}</Text>
                        <Text style={styles.cardCategory}>{reg.categoria}</Text>
                        <Text style={styles.cardDate}>
                            {new Date(reg.fechaRegistro).toLocaleDateString()}
                        </Text>
                    </View>

                    <View style={styles.pointsBadge}>
                        <Text style={styles.pointsAmount}>+{reg.puntosOtorgados}</Text>
                    </View>
                </TouchableOpacity>
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
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20
    },
    pointsBox: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 20,
        marginBottom: 25
    },
    pointsLabel: {
        fontSize: 16,
        opacity: 0.7
    },
    pointsValue: {
        fontSize: 40,
        fontWeight: "900",
        marginTop: 4
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "bold"
    },
    card: {
        flexDirection: "row",
        backgroundColor: "white",
        padding: 12,
        borderRadius: 15,
        marginBottom: 12,
        alignItems: "center"
    },
    cardImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: "#ddd"
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600"
    },
    cardCategory: {
        fontSize: 14,
        opacity: 0.7
    },
    cardDate: {
        fontSize: 13,
        opacity: 0.5
    },
    pointsBadge: {
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10
    },
    pointsAmount: {
        fontSize: 14,
        fontWeight: "bold"
    }
});
