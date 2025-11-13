import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { experienciaService, ExperienciasResponse } from '../services/experienciaService';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const InicioScreen = ({ navigation }: { navigation: any }) => {
    const { status, logout } = useAuth();

    // Estado para guardar las experiencias
    const [experiencias, setExperiencias] = useState<ExperienciasResponse[]>([]);

    // Cargar experiencias al iniciar el componente
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

    // Render de cada tarjeta del carrusel
    const renderItem = ({ item }: { item: ExperienciasResponse }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.foto_url }} style={styles.image} />
            <Text style={styles.cardTitle}>{item.titulo}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPanel}>
                <Text style={styles.title}>Experiencias Soria</Text>

                {status === 'authenticated' ? (
                    <TouchableOpacity
                        style={[styles.button, styles.smallButton]}
                        onPress={logout}
                    >
                        <Text style={styles.buttonText}>Salir</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.button, styles.smallButton]}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={experiencias}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                style={{ marginVertical: 30 }}
                snapToAlignment="center"
                decelerationRate="fast"
                snapToInterval={width * 0.7 + 20}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFEDD5', // tono base anaranjado claro
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    // 🟧 Panel flotante superior
    headerPanel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        backgroundColor: '#FFF6EF', // fondo crema suave
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6B00',
    },

    button: {
        backgroundColor: '#FF6B00',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },

    card: {
        width: width * 0.7,
        marginHorizontal: 10,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    image: {
        width: '100%',
        height: 180,
    },
    cardTitle: {
        padding: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
});

export default InicioScreen;
