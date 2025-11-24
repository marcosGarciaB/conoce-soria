import Header from "@/components/common/HeaderItem";
import MapComponent from "@/components/seeker/MapComponent";
import React, { useEffect, useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import {
	experienciaService,
	ExperienciasResponse,
} from "../services/experienceService";

const { width } = Dimensions.get("window");

const InicioScreen = ({ navigation }: { navigation: any }) => {
	const { status, logout } = useAuth();
	const url =
		"https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/recortar-bordes-imagen-r.png";
	const [experiencias, setExperiencias] = useState<ExperienciasResponse[]>(
		[]
	);

	useEffect(() => {
		const loadExperiencias = async () => {
			try {
				const data = await experienciaService.getExperiencias();
				setExperiencias(data);
			} catch (error) {
				console.error("Error cargando experiencias:", error);
			}
		};
		loadExperiencias();
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
				<Header title="Conoce Soria" icon="exit-outline" />
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
		overflow: "hidden",
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
		marginBottom: 70,
	},
});

export default InicioScreen;
