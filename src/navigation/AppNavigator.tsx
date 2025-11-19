/**
 * Lo que ve el usuario cuando no ha inciado sesión.
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import InicioScreen from "../screens/InicioScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DetailsScreen from "../screens/DetalleExperienciaScreen";
import { ExperienciasResponse } from "../services/experienciaService";
import { BottomTabs } from "./BottomTabs";

export type RootStackParamList = {
    Inicio: undefined;
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    Details:  { experiencia: ExperienciasResponse };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={BottomTabs} />
            <Stack.Screen name="Inicio" component={InicioScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
};

