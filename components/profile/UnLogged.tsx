import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface UserUnLogguedProps {
    navigation: any;
}

const UnLogged = ({ navigation }: UserUnLogguedProps) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPanel}>
                <Text style={styles.title}>Mi Perfil</Text>
                <TouchableOpacity style={[styles.smallButton]}>
                    <Ionicons name={"person"} size={30} color={"grey"} />
                </TouchableOpacity>
            </View>

            <View style={styles.innerContainer}>
                <View style={styles.formContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Iniciar sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonRegister}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <View style={styles.buttonWrapper}>
                            <Ionicons name={"person-add-sharp"} size={20} color={"black"} />
                            <Text style={styles.buttonRegisterText}> Crear Cuenta</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Contenedores generales
    container: {
        flex: 1,
        backgroundColor: '#fff8f8ff',
        paddingTop: 20,
        paddingBottom: 100,
        paddingLeft: 20,
        paddingRight: 20
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    formContainer: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#f8f3f3ff',
        padding: 40,
        borderColor: '#7a7978ff',
        borderWidth: 1,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    // Cabecera
    headerPanel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 10,
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
    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    // Botones
    buttonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#d35800ff',
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonRegister: {
        backgroundColor: '#ffeddfff',
        borderColor: '#f79e5aff',
        borderWidth: 1,
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonRegisterText: {
        color: 'black',
        fontSize: 16,
    },
    link: {
        color: '#C1440E',
        textAlign: 'center',
        marginVertical: 4,
        fontWeight: 'bold',
    },
});

export default UnLogged;