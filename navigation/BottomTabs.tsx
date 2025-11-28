import { useAdmin } from "@/hooks/useAdmin";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useAuth } from "../contexts/AuthContext";

import AdminScreen from "@/screens/AdminScreen";
import InicioScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SeekerScreen";

import CustomTabBar from "@/components/navigation/CustomTabBar";
import TopSoriaScreen from "@/screens/TopSoriaScreen";

type BottomTabParamList = {
	Inicio: undefined;
	Buscador: undefined;
	Profile: undefined;
	Admin: undefined;
	Top: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabs = () => {
	const { token } = useAuth();
	const isAdminUser = useAdmin(token);

	return (
		<Tab.Navigator
			screenOptions={{ headerShown: false }}
			tabBar={(props) => <CustomTabBar {...props} />}
		>
			<Tab.Screen name="Inicio" component={InicioScreen} />
			<Tab.Screen name="Buscador" component={SearchScreen} />
			<Tab.Screen name="Top" component={TopSoriaScreen} />
			<Tab.Screen name="Profile" component={ProfileScreen} />
			{isAdminUser && <Tab.Screen name="Admin" component={AdminScreen} />}
		</Tab.Navigator>
	);
};
