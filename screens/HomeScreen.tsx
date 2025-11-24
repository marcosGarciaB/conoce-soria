import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
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
			<View style={styles.headerPanel}>
				<Text style={styles.title}>Experiencias Soria</Text>

				{status === "authenticated" ? (
					<TouchableOpacity
						style={[styles.smallButton]}
						onPress={logout}
					>
						<Ionicons
							name={"exit-outline"}
							size={30}
							color={"grey"}
						/>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						style={[styles.smallButton]}
						onPress={() => navigation.navigate("Login")}
					>
						<Ionicons
							name={"person-circle"}
							size={30}
							color={"grey"}
						/>
					</TouchableOpacity>
				)}
			</View>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				nestedScrollEnabled={true}
			>
				<View>
					<Text style={styles.subtitle}>
						Descubre Soria a tu ritmo
					</Text>
					<Text style={styles.contentTitle}>
						Naturaleza, cultura y sabores locacles
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

				<View>
					<Text style={styles.subtitle}>
						Si está logueado, que salga su pasaporte con su
						experiencias.
					</Text>
				</View>

				<View>
					<Text style={styles.subtitle}>
						Si no está logueado, que salga el ranking general de la
						gente.
					</Text>
				</View>

				{/* <View style={styles.mapContainer}>
					<MapComponent />
				</View> */}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	// Contenedores generales
	container: {
		backgroundColor: "#FAFAFA",
		padding: 20,
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
	// Cabecera
	headerPanel: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		elevation: 5,
		backgroundColor: "white",
		borderRadius: 30,
		height: 60,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#FF6B00",
		marginLeft: 20,
	},
	// Esilos de títulos
	subtitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "black",
		marginLeft: 20,
	},
	contentTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "grey",
		marginLeft: 20,
	},
	// Botones
	smallButton: {
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 15,
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
