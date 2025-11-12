import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { experienciaService, ExperienciasResponse } from '../services/experienciaService';

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
        <View style={styles.container}>
            <Text style={styles.title}>Experiencias Soria</Text>

            {/* Carrusel horizontal */}
            <FlatList
                data={experiencias}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                style={{ marginVertical: 20 }}
                snapToAlignment="center"
                decelerationRate="fast"
                snapToInterval={width * 0.7 + 20} // ancho de la tarjeta + margen
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />

            {status === 'authenticated' ? (
                <>
                    <Text style={styles.subtitle}>¡Bienvenido de nuevo!</Text>
                    <TouchableOpacity style={styles.button} onPress={logout}>
                        <Text style={styles.buttonText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.buttonText}>Iniciar sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.buttonText}>Registrarse</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFEDD5',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF6B00',
    },
    subtitle: {
        fontSize: 18,
        color: '#C1440E',
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#FF6B00',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 10,
        marginVertical: 8,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    secondaryButton: {
        backgroundColor: '#FFA45C',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        width: width * 0.7,
        marginHorizontal: 10,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 3,
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
    },
});

export default InicioScreen;
