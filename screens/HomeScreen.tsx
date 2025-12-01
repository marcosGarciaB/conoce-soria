import Header from "@/components/common/HeaderItem";
import FlatListAnimated from "@/components/home/FlatListAnimated";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { passportService } from "@/services/passportService";
import { topService } from "@/services/topService";

import React, { useEffect, useState } from "react";
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const InicioScreen = ({ navigation }: { navigation: any }) => {
	const { status, logout, token } = useAuth();
	const isLogged = status === "authenticated";

	const [passportPreview, setPassportPreview] = useState<any[]>([]);
	const [loadingPassport, setLoadingPassport] = useState(true);

	const [passportPoints, setPassportPoints] = useState(0);
	const [passportRank, setPassportRank] = useState<number | null>(null);

	const url =
		"https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/recortar-bordes-imagen-r.png";

	// Cargar mini pasaporte
	useEffect(() => {
		const loadPassport = async () => {
			if (!isLogged || !token) return;

			try {
				const data = await passportService.getPasaporte(token);
				const primeros4 = data.registros.slice(0, 4);

				setPassportPreview(primeros4);
				setLoadingPassport(false);
			} catch (error) {
				console.log("Error cargando preview pasaporte:", error);
			}
		};

		loadPassport();
	}, [isLogged, token]);

	// Cargar puntos del usuario
	useEffect(() => {
		const loadPoints = async () => {
			if (!isLogged || !token) return;

			try {
				const user = await authService.getUserData(token);
				setPassportPoints(Number(user.puntos));
			} catch (error) {
				console.log("Error cargando puntos usuario:", error);
			}
		};

		loadPoints();
	}, [isLogged, token]);

	// Cargar ranking del usuario usando /api/top
	useEffect(() => {
		const loadRanking = async () => {
			if (!isLogged || !token) return;

			try {
				const user = await authService.getUserData(token);
				const top = await topService.getRankingData();

				const pos = top.findIndex(
					(u: any) =>
						u.nombre === user.nombre || u.email === user.email
				);
				setPassportRank(pos >= 0 ? pos + 1 : null);
			} catch (error) {
				console.log("Error cargando ranking:", error);
			}
		};

		loadRanking();
	}, [isLogged, token]);	

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

			<View style={{ paddingHorizontal: 20, marginTop: 25 }}>
					<Text style={styles.subtitle}>
						Descubre Soria a tu ritmo
					</Text>
					<Text style={styles.contentTitle}>
						Naturaleza, cultura y sabores locales
					</Text>
				</View>

			<FlatListAnimated />

			{/* <View style={styles.mapContainer}>
					<MapComponent />
				</View> */}

			{isLogged && (
				<TouchableOpacity
					style={styles.passportCard}
					onPress={() =>
						navigation.getParent()?.navigate("PassportScreen")
					}
					activeOpacity={0.9}
				>
					<Text style={styles.passportTitle}>
						Tu Pasaporte de Experiencias
					</Text>

					<View style={styles.passportHeaderRow}>
						<Text style={styles.passportPoints}>
							{passportPoints} puntos
						</Text>
						{passportRank !== null && (
							<Text style={styles.passportRanking}>
								#{passportRank} en el ranking
							</Text>
						)}
					</View>

					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.passportMiniRow}
					>
						{passportPreview.map((item, i) => (
							<View key={i} style={styles.miniItem}>
								<Image
									source={{ uri: item.imagen ?? url }}
									style={styles.miniImage}
								/>
								<Text style={styles.miniName} numberOfLines={2}>
									{item.titulo}
								</Text>
							</View>
						))}
					</ScrollView>

					<Text style={styles.passportMore}>ver más…</Text>
				</TouchableOpacity>
			)}

			{!isLogged && (
				<View>
					<Text style={styles.subtitle}>
						Si no está logueado, que salga el ranking general de la
						gente.
					</Text>
				</View>
			)}
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
	mapContainer: {
		overflow: "hidden",
		height: 250,
		width: "100%",
		marginVertical: 10,
		borderRadius: 10,
		marginBottom: 80,
	},
	// Pasaporte
	passportCard: {
		width: "90%",
		backgroundColor: "white",
		borderRadius: 20,
		padding: 20,
		marginTop: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 6,
		elevation: 5,
	},
	passportTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#FF6B00",
	},
	passportHeaderRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
	passportPoints: {
		fontSize: 15,
		fontWeight: "900",
		color: "black",
	},
	passportRanking: {
		fontSize: 16,
		color: "#777",
		alignSelf: "center",
	},
	passportMiniRow: {
		flexDirection: "row",
		paddingVertical: 10,
	},
	miniImage: {
		width: 55,
		height: 55,
		borderRadius: 30,
		marginBottom: 4,
	},
	passportMore: {
		fontSize: 16,
		marginTop: 8,
		color: "#888",
		fontStyle: "italic",
	},
	miniName: {
		fontSize: 12,
		textAlign: "center",
		color: "#555",
		width: 70,
	},
	miniItem: {
		alignItems: "center",
		marginRight: 12,
		width: 70,
	},
});

export default InicioScreen;