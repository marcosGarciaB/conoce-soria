/**
 * Lo que ve el usuario cuando no ha inciado sesión.
 */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import DetailsScreen from "@/screens/DetailsScreen";
import InicioScreen from "@/screens/HomeScreen";
import LoginScreen from "@/screens/LoginScreen";
import ManageExperienceScreen from "@/screens/ManageExperienceScreen";
import ManageUserScreen from "@/screens/ManageUserScreen";
import PassportScreen from "@/screens/PassportScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import TopSoriaScreen from "@/screens/TopSoriaScreen";
import { UserCredentials } from "@/services/authService";
import { ExperienciaDetailResponse, ExperienciasResponse } from "@/services/experienceService";
import { BottomTabs } from "./BottomTabs";

export type RootStackParamList = {
    Inicio: undefined;
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    Details: { experiencia: ExperienciasResponse };
    Profile: undefined;
    ManageUser: { user: UserCredentials };
    ManageExperience: { experiencia: ExperienciaDetailResponse };
    Passport: undefined;
    Top: undefined;
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
            <Stack.Screen name="ManageUser" component={ManageUserScreen} />
            <Stack.Screen name="ManageExperience" component={ManageExperienceScreen} />
            <Stack.Screen name="Passport" component={PassportScreen} />
            <Stack.Screen name="Top" component={TopSoriaScreen} />
        </Stack.Navigator>
    );
};

