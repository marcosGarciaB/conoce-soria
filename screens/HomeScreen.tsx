import Header from "@/components/common/HeaderItem";
import LoadingScreen from "@/components/common/Loading";
import FlatListAnimated from "@/components/home/FlatListAnimated";
import Information from "@/components/home/Information";
import MiniPassport from "@/components/home/MiniPassport";
import Ranking from "@/components/top/Ranking";
import { useAuth } from "@/contexts/AuthContext";
import { useLoadTop } from "@/hooks/useLoadTop";
import { LinearGradient } from "expo-linear-gradient";

import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const InicioScreen = ({ navigation }: { navigation: any }) => {
	const { status, logout } = useAuth();
	const isLogged = status === "authenticated";
	const { topUsuarios } = useLoadTop();

	if (status === "checking") return <LoadingScreen />

	return (
		<SafeAreaView style={styles.container}>

			{isLogged ? (
				<Header
					title="Conoce Soria"
					icon="home-outline"
					isSecondIcon={true}
					icon2="log-out-outline"
					onPress={logout}
				/>
			) : (
				<Header title="Conoce Soria" icon="person-circle" />
			)}

			<View style={{ flex: 1 }}>
				
			</View>
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
				<View style={styles.mapContainer}>
					{/* <MapComponent /> */}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
		height: 300,
		width: "100%",
		marginVertical: 10,
		borderRadius: 10,
		marginBottom: 80,
	},
});

export default InicioScreen;
