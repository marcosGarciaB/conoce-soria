import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { authService, UserCredentials } from "../services/authService";

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }: { navigation: any }) => {
    const { token } = useAuth();
    const [user, setUser] = useState<UserCredentials>();

    useEffect(() => {
        const loadUser = async () => {
            if (!token) return;

            try {
                const data = await authService.getUserData(token);
                setUser(data);
            } catch (error) {
                console.error('Error cargando el usuario:', error);
            }
        }
        loadUser();
    }, [token]);

    if (!user) return <Text>Cargando...</Text>;

    return (


        <SafeAreaView style={styles.container}>
            <View style={styles.headerPanel}>
                <Text style={styles.title}>Mi Perfil</Text>

                {token === 'authenticated' ? (
                    // Pasar después la componente de loggued
                    <TouchableOpacity
                        style={[styles.smallButton]}
                    >
                        <Ionicons name={"exit-outline"} size={30} color={"grey"} />
                    </TouchableOpacity>

                ) : (

                    // Pasar después la componente de unloggued

                    <TouchableOpacity
                        style={[styles.smallButton]}
                    >
                        <Ionicons name={"person-circle"} size={30} color={"grey"} />
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.profileContainer}>
                    <Ionicons name="person-circle" size={120} color="#FF6B00" />
                    <Text style={styles.profileName}>{user.nombre}</Text>
                    <Text style={styles.profileEmail}>{user.email}</Text>

                    <View style={styles.infoChips}>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>Puntos: {user.puntos}</Text>
                        </View>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionText}>Cambiar nombre</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionText}>Cambiar correo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionText}>Cambiar contraseña</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionText}>Política de privacidad</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF6B00' }]}>
                            <Text style={[styles.actionText, { color: 'white' }]}>Cerrar sesión</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Contenedores generales
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
    // Cabecera
    headerPanel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: 'white',
        borderRadius: 30,
        height: 60,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6B00',
        marginLeft: 20,
    },
    // Esilos de títulos 
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 20,
    },
    contentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'grey',
        marginLeft: 20,
    },
    // Botones
    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    // Card
    card: {
        width: width * 0.7,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
        margin: 10,
        shadowColor: '#000000ff',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2
    },
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    cardTitle: {
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    profileContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },

    profileName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },

    profileEmail: {
        fontSize: 16,
        color: 'grey',
        marginBottom: 20,
    },

    infoChips: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 30,
    },

    chip: {
        backgroundColor: '#ffe6d5',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },

    chipText: {
        color: '#FF6B00',
        fontWeight: 'bold',
    },

    actionButtons: {
        width: '100%',
        gap: 10,
    },

    actionButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    actionText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },

});

export default ProfileScreen;
