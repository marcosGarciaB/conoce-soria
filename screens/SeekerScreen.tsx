import DetailFlatListAnimated from "@/components/seeker/DetailFlatListAnimated";
import { useAuth } from "@/contexts/AuthContext";
import { ExperienciasResponse } from "@/services/experienceService";

import React from "react";
import { Platform, UIManager } from "react-native";

if (Platform.OS === "android") {
	UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const SearchScreen = ({ navigation }: { navigation: any }) => {
	const { status } = useAuth();
	const isLogged = status === "authenticated";

	const handlePressExperiencia = (experiencia: ExperienciasResponse) => {
		navigation.navigate(isLogged ? "Details" : "Login", { experiencia });
	};

	return <DetailFlatListAnimated onPress={handlePressExperiencia} />;
};

export default SearchScreen;
