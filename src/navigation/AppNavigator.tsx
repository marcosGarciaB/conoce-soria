/**
 * Lo que ve el usuario cuando no ha iniciado sesión.
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import InicioScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DetailsScreen from "../screens/ExperiencesDetailsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PassportScreen from "../screens/PassportScreen";

import { ExperienciasResponse } from "../services/experienceService";
import { BottomTabs } from "./BottomTabs";

export type RootStackParamList = {
    Inicio: undefined;
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    Details: { experiencia: ExperienciasResponse };
    Profile: undefined;
    PassportScreen: undefined;
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
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="PassportScreen" component={PassportScreen} /> 
        </Stack.Navigator>
    );
};
