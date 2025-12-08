import { useNearExperiences } from "@/hooks/useNearExperiences";
import { ExperienciasResponse } from "@/services/experienceService";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import LoadingScreen from "../common/Loading";

const { width } = Dimensions.get("screen");
const bannerWidth = width - 20;
const bannerHeight = bannerWidth;

interface NearExperienceProps {
	navigation: any;
}

const NearExperience = ({ navigation }: NearExperienceProps) => {
	const { nearestExperience, loading, permissionGranted } =
		useNearExperiences();

	if (loading) return <LoadingScreen />;
	if (!permissionGranted) return null;
	if (!nearestExperience) return null;

	const handleExperiencePress = () => {
		const experiencia: ExperienciasResponse = {
			id: nearestExperience.id,
			categoria: nearestExperience.categoria,
			imagenPortadaUrl: nearestExperience.imagenPortadaUrl,
			titulo: nearestExperience.titulo,
		};
		navigation.navigate("Details", { experiencia });
	};

	const handleSeeAllPress = () => {
		navigation.navigate("NearExperiencesList");
	};

	return (
		<View style={styles.container}>
			<LinearGradient
				colors={["#fcfcfcff", "#fafcfcff", "#fafcfcff", "#fcfcfcff"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.banner}
			>
				<TouchableOpacity
					style={styles.previewContainer}
					onPress={handleExperiencePress}
					activeOpacity={0.8}
				>
					<View style={styles.imageContainer}>
						<Image
							source={{ uri: nearestExperience.imagenPortadaUrl }}
							style={styles.image}
						/>
						<View style={styles.overlay}>
							<Text
								style={styles.experienceTitle}
								numberOfLines={2}
							>
								{nearestExperience.titulo}
							</Text>
							<View style={styles.distanceContainer}>
								<Ionicons
									name="location"
									size={16}
									color="#fff"
									style={styles.distanceIcon}
								/>
								<Text style={styles.distanceText}>
									{nearestExperience.formattedDistance}
								</Text>
							</View>
						</View>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.ctaButton}
					onPress={handleSeeAllPress}
					activeOpacity={0.8}
				>
					<Text style={styles.ctaText}>Ver las más cercanas</Text>
					<Ionicons
						name="chevron-forward"
						size={20}
						color="#008cffff"
					/>
				</TouchableOpacity>
			</LinearGradient>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		marginVertical: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 5,
		paddingBottom: 20
	},
	banner: {
		width: bannerWidth,
		height: bannerHeight,
		borderRadius: 24,
		padding: 20,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 20,
		elevation: 5,
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		color: "#1a1a1a",
		marginBottom: 15,
		textAlign: "center",
	},
	previewContainer: {
		flex: 1,
		borderRadius: 15,
		overflow: "hidden",
		marginBottom: 15,
	},
	imageContainer: {
		flex: 1,
		position: "relative",
	},
	image: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	overlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		padding: 15,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},
	experienceTitle: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 8,
		textShadowColor: "rgba(0, 0, 0, 0.75)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 4,
	},
	distanceContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	distanceIcon: {
		marginRight: 5,
	},
	distanceText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "600",
		textShadowColor: "rgba(0, 0, 0, 0.75)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 4,
	},
	ctaButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f0f8ff",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 30,
		borderWidth: 1,
		borderColor: "#008cffff",
	},
	ctaText: {
		color: "#008cffff",
		fontSize: 16,
		fontWeight: "600",
		marginRight: 8,
	},
});

export default NearExperience;
