/**
 * Lo que ve el usuario cuando no ha inciado sesión.
 */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import DetailsScreen from "@/screens/DetailsScreen";
import LoginScreen from "@/screens/LoginScreen";
import ManageExperienceScreen from "@/screens/ManageExperienceScreen";
import ManageUIDsScreen from "@/screens/ManageUIDsScreen";
import ManageUserScreen from "@/screens/ManageUserScreen";
import NearExperiencesListScreen from "@/screens/NearExperiencesScreen";
import PassportScreen from "@/screens/PassportScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import QrScannerScreen from "@/screens/QrScannerScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import TopSoriaScreen from "@/screens/TopScreen";
import { UserCredentials } from "@/services/authService";
import {
	ExperienciaDetailResponse,
	ExperienciasResponse,
} from "@/services/experienceService";
import { BottomTabs } from "./BottomTabs";

export type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	MainTabs: undefined;
	Details: { experiencia: ExperienciasResponse };
	Profile: undefined;
	ManageUser: { user: UserCredentials };
	ManageExperience: { experiencia: ExperienciaDetailResponse };
	ManageUIDs: { experiencia: ExperienciaDetailResponse };
	QrScanner: { experienciaId: number };
	Passport: undefined;
	Top: undefined;
	NearExperiencesList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="MainTabs" component={BottomTabs} />
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Register" component={RegisterScreen} />
			<Stack.Screen name="Details" component={DetailsScreen} />
			<Stack.Screen name="Profile" component={ProfileScreen} />
			<Stack.Screen name="ManageUser" component={ManageUserScreen} />
			<Stack.Screen
				name="ManageExperience"
				component={ManageExperienceScreen}
			/>
			<Stack.Screen name="ManageUIDs" component={ManageUIDsScreen} />
			<Stack.Screen name="QrScanner" component={QrScannerScreen} />

			<Stack.Screen name="Passport" component={PassportScreen} />
			<Stack.Screen name="Top" component={TopSoriaScreen} />
			<Stack.Screen
				name="NearExperiencesList"
				component={NearExperiencesListScreen}
			/>
		</Stack.Navigator>
	);
};
