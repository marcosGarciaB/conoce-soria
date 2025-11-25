import React, { useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, FlatList, Image,
    Dimensions, ScrollView
} from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { experienciaService, ExperienciasResponse } from '../services/experienceService';
import { passportService } from "../services/passportService";
import { authService } from "../services/authService";

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

const InicioScreen = ({ navigation }: { navigation: any }) => {

    const { status, logout, token } = useAuth();
    const isLogged = status === "authenticated";

    // MINI EXPERIENCIAS DEL PASAPORTE
    const [passportPreview, setPassportPreview] = useState<any[]>([]);
    const [loadingPassport, setLoadingPassport] = useState(true);

    // NUEVOS ESTADOS
    const [passportPoints, setPassportPoints] = useState(0);
    const [passportRank, setPassportRank] = useState<number | null>(null);

    const [experiencias, setExperiencias] = useState<ExperienciasResponse[]>([]);

    const placeholderImg = "https://picsum.photos/400";

    // ---------------------------------------------------------------
    // CARGAR EXPERIENCIAS
    // ---------------------------------------------------------------
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

    // ---------------------------------------------------------------
    // CARGAR MINI PASAPORTE
    // ---------------------------------------------------------------
    useEffect(() => {
        const loadPassport = async () => {
            if (!isLogged || !token) return;

            try {
                const data = await passportService.getPasaporte(token);
                const primeros4 = data.registros.slice(0, 4);

                setPassportPreview(primeros4);
                setLoadingPassport(false);

            } catch (error) {
                console.log("Error cargando preview pasaporte:", error);
            }
        };

        loadPassport();
    }, [isLogged, token]);

    // ---------------------------------------------------------------
    // CARGAR PUNTOS DEL USUARIO
    // ---------------------------------------------------------------
    useEffect(() => {
        const loadPoints = async () => {
            if (!isLogged || !token) return;

            try {
                const user = await authService.getUserData(token);
                setPassportPoints(Number(user.puntos));


            } catch (error) {
                console.log("Error cargando puntos usuario:", error);
            }
        };

        loadPoints();
    }, [isLogged, token]);

    // ---------------------------------------------------------------
    // CARGAR RANKING DEL USUARIO
    // ---------------------------------------------------------------
    useEffect(() => {
    const loadRanking = async () => {
        if (!isLogged || !token) return;

        try {
            // 1. obtener usuario logueado
            const user = await authService.getUserData(token);

            // 2. obtener lista del top
            const top = await authService.getRankingData(); // /api/top

            // 3. buscar posición
            const pos = top.findIndex(u => u.nombre === user.nombre);

            setPassportRank(pos >= 0 ? pos + 1 : null);

        } catch (error) {
            console.log("Error cargando ranking:", error);
        }
    };

    loadRanking();
}, [isLogged, token]);

    // ---------------------------------------------------------------
    // RENDER ITEM DEL CARRUSEL
    // ---------------------------------------------------------------
    const renderItem = ({ item }: { item: ExperienciasResponse }) => (
        <View style={styles.card}>
            <Image source={{ uri: placeholderImg }} style={styles.image} />
            <Text style={styles.cardTitle}>{item.titulo}</Text>
        </View>
    );

    // ---------------------------------------------------------------
    // UI
    // ---------------------------------------------------------------
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

                {/* TITULOS */}
                <View>
                    <Text style={styles.subtitle}>Descubre Soria a tu ritmo</Text>
                    <Text style={styles.contentTitle}>Naturaleza, cultura y sabores locales</Text>
                </View>

                {/* CARRUSEL */}
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

                {/* TARJETA DEL PASAPORTE */}
                {isLogged && (
                    <TouchableOpacity
                        style={styles.passportCard}
                        onPress={() => navigation.getParent()?.navigate("PassportScreen")}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.passportTitle}>Tu Pasaporte de Experiencias</Text>

                        <View style={styles.passportHeaderRow}>
                            <Text style={styles.passportPoints}>{passportPoints} puntos</Text>
                            {passportRank !== null && (
                                <Text style={styles.passportRanking}>#{passportRank} en el ranking</Text>
                            )}
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.passportMiniRow}
                        >
                            {passportPreview.map((item, i) => (
                                <View key={i} style={styles.miniItem}>
                                    <Image
                                        source={{ uri: item.imagen ?? placeholderImg }}
                                        style={styles.miniImage}
                                    />
                                    <Text style={styles.miniName}>{item.titulo}</Text>
                                </View>
                            ))}
                        </ScrollView>


                        <Text style={styles.passportMore}>ver más…</Text>
                    </TouchableOpacity>
                )}

                {/* Ranking si no está logueado */}
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


// ---------------------------------------------------------------
// ESTILOS
// ---------------------------------------------------------------
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff8f8ff',
        padding: 20
    },

    carouselContainer: {
        width: '100%',
        marginTop: 30
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        alignItems: 'center'
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
        color: '#FF6B00'
    },

    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 20
    },

    contentTitle: {
        fontSize: 18,
        color: 'grey',
        fontWeight: 'bold',
        marginLeft: 20
    },

    smallButton: {
        padding: 10
    },

    card: {
        width: width * 0.7,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
        margin: 10,
        elevation: 2
    },

    image: {
        width: '100%',
        height: 180
    },

    cardTitle: {
        padding: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    // TARJETA PASAPORTE
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
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF6B00"
    },

    passportHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },

    passportPoints: {
        fontSize: 15,
        fontWeight: "900",
        color: "black"
    },

    passportRanking: {
        fontSize: 16,
        color: "#777",
        alignSelf: "center"
    },

    passportMiniRow: {
    flexDirection: "row",
    paddingVertical: 10
    },

    miniImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginBottom: 4
    },
    

    passportMore: {
        fontSize: 16,
        marginTop: 8,
        color: "#888",
        fontStyle: "italic"
    },
    miniName: {
    fontSize: 12,
    textAlign: "center",
    color: "#555"
    },

    miniItem: {
    alignItems: "center",
    marginRight: 12,
    width: 70
},


miniText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
    color: "black"
},


});

export default InicioScreen;
