import React, { useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, FlatList, Image,
    Dimensions, ScrollView
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { experienciaService, ExperienciasResponse } from '../services/experienceService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { passportService } from "../services/passportService";

const { width } = Dimensions.get('window');

const InicioScreen = ({ navigation }: { navigation: any }) => {
    const { status, logout, token } = useAuth();
    const isLogged = status === "authenticated";

    // 🔥 ESTADO DEL PASAPORTE (primeras 4 experiencias)
    const [passportPreview, setPassportPreview] = useState<any[]>([]);
    const [loadingPassport, setLoadingPassport] = useState(true);

    const url = "https://picsum.photos/400";

    const [experiencias, setExperiencias] = useState<ExperienciasResponse[]>([]);

    // Cargar experiencias generales
    useEffect(() => {
        const loadExperiencias = async () => {
            try {
                const data = await experienciaService.getExperiencias();
                setExperiencias(data);
            } catch (error) {
                console.error('Error cargando experiencias:', error);
            }
        };
        loadExperiencias();
    }, []);

    // 🔥 Cargar pasepaporte para la tarjeta
    useEffect(() => {
        const loadPassport = async () => {
            if (!isLogged || !token) return;

            try {
                const data = await passportService.getPasaporte(token);

                const primeros4 = data.registros.slice(0, 4);
                console.log(">>> PREVIEW PASAPORTE:", primeros4);

                setPassportPreview(primeros4);
            } catch (error) {
                console.log("Error cargando preview pasaporte:", error);
            } finally {
                setLoadingPassport(false);
            }
        };

        loadPassport();
    }, [isLogged, token]);

    const renderItem = ({ item }: { item: ExperienciasResponse }) => (
        <View style={styles.card}>
            <Image source={{ uri: url }} style={styles.image} />
            <Text style={styles.cardTitle}>{item.titulo}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPanel}>
                <Text style={styles.title}>Experiencias Soria</Text>

                {isLogged ? (
                    <TouchableOpacity style={styles.smallButton} onPress={logout}>
                        <Ionicons name={"exit-outline"} size={30} color={"grey"} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Login')}>
                        <Ionicons name={"person-circle"} size={30} color={"grey"} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Títulos */}
                <View>
                    <Text style={styles.subtitle}>Descubre Soria a tu ritmo</Text>
                    <Text style={styles.contentTitle}>Naturaleza, cultura y sabores locales</Text>
                </View>

                {/* Carrusel */}
                <View style={styles.carouselContainer}>
                    <FlatList
                        data={experiencias}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        snapToAlignment="center"
                        decelerationRate="fast"
                        snapToInterval={width * 0.8 + 30}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                    />
                </View>

                {/* 🔥 TARJETA DEL PASAPORTE REAL */}
                {isLogged && (
                    <TouchableOpacity
                        style={styles.passportCard}
                        onPress={() => navigation.navigate("PassportScreen")}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.passportTitle}>Tu Pasaporte</Text>

                        <View style={{ marginTop: 10 }}>

                            {/* Si está cargando */}
                            {loadingPassport && (
                                <Text style={styles.passportItem}>Cargando...</Text>
                            )}

                            {/* Si NO hay experiencias */}
                            {!loadingPassport && passportPreview.length === 0 && (
                                <Text style={styles.passportItem}>Aún no has registrado experiencias</Text>
                            )}

                            {/* Si hay experiencias */}
                            {passportPreview.length > 0 &&
                                passportPreview.map((item, i) => (
                                    <Text key={i} style={styles.passportItem}>
                                        • {item.titulo}
                                    </Text>
                                ))
                            }

                            <Text style={styles.passportMore}>ver más…</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Ranking */}
                {!isLogged && (
                    <View>
                        <Text style={styles.subtitle}>
                            Si no está logueado, que salga el ranking general de la gente.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff8f8ff',
        padding: 20
    },
    carouselContainer: {
        width: '100%',
        marginTop: 30,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        alignItems: 'center',
    },
    headerPanel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
        height: 60,
        paddingHorizontal: 20,
        elevation: 5
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6B00',
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 20,
    },
    contentTitle: {
        fontSize: 18,
        color: 'grey',
        fontWeight: 'bold',
        marginLeft: 20,
    },
    smallButton: { padding: 10 },
    card: {
        width: width * 0.7,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
        margin: 10,
        elevation: 2
    },
    image: { width: '100%', height: 180 },
    cardTitle: {
        padding: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    // 🟧 TARJETA PASAPORTE
    passportCard: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5
    },
    passportTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#FF6B00"
    },
    passportItem: {
        fontSize: 16,
        marginTop: 4
    },
    passportMore: {
        fontSize: 16,
        marginTop: 8,
        color: "#888",
        fontStyle: "italic"
    }
});

export default InicioScreen;
