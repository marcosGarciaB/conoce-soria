/**
 * Define el navegador de autenticación usando React Navigation.
 * - Contiene las pantallas de login y registro.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// Tipo de navegación donde las pantallas se apilan una encima de otra.
const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false,}}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
};
