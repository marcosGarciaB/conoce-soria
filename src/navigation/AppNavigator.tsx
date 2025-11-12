/**
 * Navegador para cuando el usuario no esté autenticado.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InicioScreen from '../screens/InicioScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
    return (
        <Stack.Navigator  initialRouteName="Inicio">
            <Stack.Screen
                name="Inicio"
                component={InicioScreen}
                options={{  headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Iniciar Sesión' }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: 'Registro' }}
            />
        </Stack.Navigator>
    );
};
