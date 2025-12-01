import Header from "@/components/common/HeaderItem";
import FlatListAnimated from "@/components/home/FlatListAnimated";
import Information from "@/components/home/Information";
import MiniPassport from "@/components/home/MiniPassport";
import Ranking from "@/components/top/Ranking";
import { useAuth } from "@/contexts/AuthContext";
import { useLoadTop } from "@/hooks/useLoadTop";

import React from "react";
import {
	ScrollView,
	StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const InicioScreen = ({ navigation }: { navigation: any }) => {
	const { status, logout } = useAuth();
	const isLogged = status === "authenticated";
	const { topUsuarios } = useLoadTop();

	return (
		<SafeAreaView style={styles.container}>

			{isLogged ? (
				<Header
					title="Conoce Soria"
					icon="home-outline"
					isSecondIcon={true}
					icon2="exit-outline"
					onPress={logout}
				/>
			) : (
				<Header title="Conoce Soria" icon="person-circle" />
			)}

			<ScrollView
				contentContainerStyle={{ paddingBottom: 40 }}
				showsVerticalScrollIndicator={false}
			>
				<Information />
				<FlatListAnimated />

				{isLogged ? (
					<MiniPassport navigation={navigation} />
				) : (
					<Ranking topUsuarios={topUsuarios} navigation={navigation} isHome={true} />
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
		padding: 5,
		marginBottom: 30,
	},
	carouselContainer: {
		width: "100%",
		marginTop: 30,
	},
	scrollContent: {
		paddingTop: 20,
		alignItems: "center",
	},
	mapContainer: {
		overflow: "hidden",
		height: 250,
		width: "100%",
		marginVertical: 10,
		borderRadius: 10,
		marginBottom: 80,
	},
});

export default InicioScreen;
