/**
 * Navegador para cuando el usuario esté autenticado.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InicioScreen from "../screens/InicioScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DetailsScreen from "../screens/DetalleExperienciaScreen"

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Inicio">
            <Stack.Screen name="Inicio" component={InicioScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
};
