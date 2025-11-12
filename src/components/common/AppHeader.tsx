/**
 * Parte superior de la aplicación.
 */

import React from "react";
import { View, Button, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from '@react-navigation/native';
//import { RootStackNavigationProp } from '../../navigation/AppNavigator';

export const AppHeader = () => {
    const { status, logout } = useAuth();
    //const navigation = useNavigation<RootStackNavigationProp>();

    if (status === 'checking') {
        return <ActivityIndicator color="#000" />;
    }

    if (status === 'authenticated') {
        return (
            <View style={styles.container}>
                <Text style={styles.welcomeText}>Bienvenido</Text>
                <Button title="Cerrar Sesión" onPress={logout} />
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <Button
                title="Iniciar Sesión"
                //onPress={() => navigation.navigate('Auth')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    welcomeText: {
        marginRight: 10,
        fontSize: 16,
    }
});