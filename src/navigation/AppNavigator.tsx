/**
 * Lo que ve el usuario cuando no ha inciado sesión.
 * 
 * Tengo que arreglarlo para que vea algo de la aplicación cuando
 * no haya inciado sesión.
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DetailsScreen from "../screens/DetalleExperienciaScreen";
import { BottomTabs } from "./BottomTabs";
import { ExperienciasResponse } from "../services/experienciaService";

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    Details:  { experiencia: ExperienciasResponse };

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="MainTabs" component={BottomTabs} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
};
