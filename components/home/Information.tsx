import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

const Information = () => {
	return (
		<LinearGradient
			colors={["#cfcfcfff", "#ffffffff", "#fffffe", "#cfcfcfff"]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.heroContainer}
		>
			<View style={styles.heroContent}>
				<Text style={styles.heroTitle}>
					Explora. Disfruta. Siente Soria.
				</Text>
				<Text style={styles.heroSubtitle}>
					La magia de una tierra auténtica en la palma de tu mano.
				</Text>
			</View>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	heroContainer: {
		margin: 10,
		paddingHorizontal: 22,
		paddingVertical: 28,
		borderRadius: 24,
		marginTop: 20,
		marginBottom: 20,
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOpacity: 0.5,
		shadowRadius: 20,
		elevation: 5,
	},
	heroContent: {
		gap: 6,
	},
	heroTitle: {
		fontSize: 20,
		fontWeight: "800",
		color: "#1a1a1a",
	},
	heroSubtitle: {
		fontSize: 15,
		color: "#555",
		opacity: 0.9,
		lineHeight: 26,
		fontWeight: "500",
	},
});

export default Information;
