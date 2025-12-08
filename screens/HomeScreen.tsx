import LoadingScreen from "@/components/common/Loading";
import TitleHeader from "@/components/common/TitleHeader";
import FlatListAnimated from "@/components/home/FlatListAnimated";
import Information from "@/components/home/Information";
import MapComponent from "@/components/home/MapComponent";
import MiniPassport from "@/components/home/MiniPassport";
import NearExperience from "@/components/home/NearExperience";
import Ranking from "@/components/top/Ranking";
import { useAuth } from "@/contexts/AuthContext";
import { useLoadTop } from "@/hooks/useLoadTop";

import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const InicioScreen = ({ navigation }: { navigation: any }) => {
	const { status } = useAuth();
	const isLogged = status === "authenticated";
	const { topUsuarios } = useLoadTop();

	if (status === "checking") return <LoadingScreen />;

	return (
		<ScrollView
			contentContainerStyle={{ paddingBottom: 50 }}
			showsVerticalScrollIndicator={false}
		>
			<Information />
			<FlatListAnimated />

			{isLogged ? (
				<MiniPassport navigation={navigation} />
			) : (
				<Ranking
					topUsuarios={topUsuarios}
					navigation={navigation}
					isHome={true}
				/>
			)}

			<TitleHeader title="Localizaciones" />

			<View style={styles.mapContainer}>
				<MapComponent />
			</View>

			<TitleHeader title="Experiencias más cercanas" />
			<NearExperience navigation={navigation} />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	mapContainer: {
		overflow: "hidden",
		height: 300,
		borderRadius: 10,
		marginBottom: 20,
		margin: 10
	},
});

export default InicioScreen;
