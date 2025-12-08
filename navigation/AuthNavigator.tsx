/**
 * Navegador para cuando el usuario cuando haya iniciado sesión.
 */

import ManageExperienceScreen from "@/screens/ManageExperienceScreen";
import ManageUIDsScreen from "@/screens/ManageUIDsScreen";
import ManageUserScreen from "@/screens/ManageUserScreen";
import NearExperiencesListScreen from "@/screens/NearExperiencesScreen";
import PassportScreen from "@/screens/PassportScreen";
import QrScannerScreen from "@/screens/QrScannerScreen";
import { UserCredentials } from "@/services/authService";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DetailsScreen from "../screens/DetailsScreen";
import {
    ExperienciaDetailResponse,
    ExperienciasResponse,
} from "../services/experienceService";
import { BottomTabs } from "./BottomTabs";

export type AuthStackParamList = {
	Inicio: undefined;
	Buscador: undefined;
	Login: undefined;
	Register: undefined;
	MainTabs: undefined;
	Details: { experiencia: ExperienciasResponse };
	Profile: undefined;
	ManageUser: { user: UserCredentials };
	ManageExperience: { experiencia: ExperienciaDetailResponse };
	ManageUIDs: { experiencia: ExperienciaDetailResponse };
	QrScanner: { experienciaId: number };
	PassportScreen: undefined;
	NearExperiencesList: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
	return (
		<Stack.Navigator
			initialRouteName="MainTabs"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="MainTabs" component={BottomTabs} />
			<Stack.Screen name="Details" component={DetailsScreen} />
			<Stack.Screen name="ManageUser" component={ManageUserScreen} />
			<Stack.Screen
				name="ManageExperience"
				component={ManageExperienceScreen}
			/>
			<Stack.Screen name="ManageUIDs" component={ManageUIDsScreen} />
			<Stack.Screen name="QrScanner" component={QrScannerScreen} />
			<Stack.Screen name="PassportScreen" component={PassportScreen} />
			<Stack.Screen
				name="NearExperiencesList"
				component={NearExperiencesListScreen}
			/>
		</Stack.Navigator>
	);
};
