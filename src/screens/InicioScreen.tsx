/**
 * Pantalla de Inicio (Home).
 */

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const InicioScreen = () => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Experiencias Soria</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
});

export default InicioScreen;