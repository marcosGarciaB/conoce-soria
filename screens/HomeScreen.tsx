import Header from "@/components/common/HeaderItem";
import MapComponent from "@/components/seeker/MapComponent";
import { useAuth } from "@/contexts/AuthContext";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { experienciaService, ExperienciasResponse, } from "@/services/experienceService";

import React, { useEffect } from "react";
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const InicioScreen = ({ navigation }: { navigation: any }) => {
	const { status, logout } = useAuth();
	const url =
		"https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/recortar-bordes-imagen-r.png";

	const { data: experiencias, loadData: loadExperiencias, loading, hasMore } = usePaginatedFetch<ExperienciasResponse>({
		fetchFunction: experienciaService.getExperiencias,
		pageSize: 5,
	});

	useEffect(() => {
		loadExperiencias(true);
	}, []);

	const renderItem = ({ item }: { item: ExperienciasResponse }) => (
		<View style={styles.card}>
			<Image source={{ uri: url }} style={styles.image} />
			<Text style={styles.cardTitle}>{item.titulo}</Text>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			{status === "authenticated" ? (
				<Header title="Conoce Soria" icon="home-outline" isSecondIcon={true} icon2="exit-outline" onPress={logout} />
			) : (
				<Header title="Conoce Soria" icon="person-circle" />
			)}

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				nestedScrollEnabled={true}
			>
				<View style={{ paddingHorizontal: 20, marginTop: 25 }}>
					<Text style={styles.subtitle}>
						Descubre Soria a tu ritmo
					</Text>
					<Text style={styles.contentTitle}>
						Naturaleza, cultura y sabores locales
					</Text>
				</View>

				<View style={styles.carouselContainer}>
					<FlatList
						data={experiencias}
						horizontal
						showsHorizontalScrollIndicator={false}
						keyExtractor={(item) => item.id.toString()}
						renderItem={renderItem}
						snapToAlignment="center"
						decelerationRate="fast"
						snapToInterval={width * 0.8 + 30}
						contentContainerStyle={{ paddingHorizontal: 10 }}
						onEndReached={() => loadExperiencias()}
						onEndReachedThreshold={0.5}
						ListFooterComponent={
							loading
								? <ActivityIndicator size="large" color="#333" style={{ margin: 20 }} />
								: null
						}
					/>
				</View>

				<View style={styles.mapContainer}>
					<MapComponent />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	// Contenedores generales
	container: {
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
	// Esilos de títulos
	subtitle: {
		fontSize: 26,
		fontWeight: "700",
		color: "#1E1E1E",
		marginLeft: 20,
		marginBottom: 5,
	},
	contentTitle: {
		fontSize: 18,
		fontWeight: "500",
		color: "#6B6B6B",
		marginLeft: 20,
	},
	// Card
	card: {
		width: width * 0.7,
		borderRadius: 15,
		backgroundColor: "#fff",
		margin: 10,
		shadowColor: "#000000ff",
		shadowOffset: { width: 3, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 2,
	},
	image: {
		width: "100%",
		height: 180,
		resizeMode: "cover",
	},
	cardTitle: {
		paddingTop: 10,
		paddingBottom: 10,
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
		color: "#333",
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
