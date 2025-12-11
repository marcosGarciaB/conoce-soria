import React from "react";
import { ScrollView } from "react-native";

import { useAuth } from "../contexts/AuthContext";

import Logged from "../components/profile/Logged";
import UnLogged from "../components/profile/UnLogged";

const ProfileScreen = ({ navigation }: { navigation: any }) => {
	const { token, logout } = useAuth();

	const isLogged = !!token;

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ padding: 10 }}
		>
			{isLogged ? (
				<Logged token={token} onPress={logout}  />
			) : (
				<UnLogged navigation={navigation} />
			)}
		</ScrollView>
	);
};

export default ProfileScreen;
