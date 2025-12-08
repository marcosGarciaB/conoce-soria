import { useAdmin } from "@/hooks/useAdmin";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useAuth } from "../contexts/AuthContext";

import AdminScreen from "@/screens/AdminScreen";
import InicioScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SeekerScreen";

import HeaderGeneral from "@/components/common/HeaderItem";
import CustomTabBar from "@/components/navigation/CustomTabBar";
import TopSoriaScreen from "@/screens/TopScreen";

type BottomTabParamList = {
	Inicio: undefined;
	Buscador: undefined;
	Profile: undefined;
	Admin: undefined;
	Top: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabs = () => {
	const { logout, token, status } = useAuth();
	const isAdminUser = useAdmin(token);

	return (
		<Tab.Navigator
			screenOptions={{ headerShown: true }}
			tabBar={(props) => <CustomTabBar {...props} />}
		>
			<Tab.Screen
				name="Inicio"
				component={InicioScreen}
				options={{
					header: () => 
					{
						return status === "authenticated" ?
						<HeaderGeneral title="Conoce Soria" icon2={"log-out"} onPress={logout}/>
						: 
						<HeaderGeneral title="Conoce Soria"/>
					}
				}}
			/>
			<Tab.Screen
				name="Buscador"
				component={SearchScreen}
				options={{
					header: () => <HeaderGeneral title="Explorar" />,
				}}
			/>
			<Tab.Screen
				name="Top"
				component={TopSoriaScreen}
				options={{
					header: () => <HeaderGeneral title="Top Soria" />,
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					header: () => <HeaderGeneral title="Perfil" />,
				}}
			/>
			{isAdminUser && (
				<Tab.Screen
					name="Admin"
					component={AdminScreen}
					options={{
						header: () => <HeaderGeneral title="Admin" />,
					}}
				/>
			)}
		</Tab.Navigator>
	);
};
