import { useStaggeredItemAnimation } from "@/components/animations/staggeredItemAnimation";
import { ExperienceWithDistance } from "@/hooks/useNearExperiences";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

interface Props {
	item: ExperienceWithDistance;
	index: number;
	onPress: (exp: ExperienceWithDistance) => void;
}

const NearExperienceItem = ({ item, index, onPress }: Props) => {
	const { entering } = useStaggeredItemAnimation(index);

	return (
		<Animated.View entering={entering} style={styles.card}>
			<TouchableOpacity
				style={styles.inner}
				onPress={() => onPress(item)}
				activeOpacity={0.8}
			>
				<Image
					source={{ uri: item.imagenPortadaUrl }}
					style={styles.cardImage}
				/>

				<View style={styles.cardContent}>
					<Text style={styles.cardTitle} numberOfLines={2}>
						{item.titulo}
					</Text>

					<View style={styles.distanceContainer}>
						<Ionicons name="location" size={16} color="#008cffff" />
						<Text style={styles.distanceText}>
							{item.formattedDistance}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	card: {
		marginBottom: 15,
	},
	inner: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 15,
		overflow: "hidden",
		elevation: 4,
	},
	cardImage: {
		width: 120,
		height: 120,
	},
	cardContent: {
		flex: 1,
		padding: 15,
		justifyContent: "space-between",
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "700",
	},
	distanceContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	distanceText: {
		color: "#008cffff",
		fontWeight: "600",
		marginLeft: 5,
	},
});

export default NearExperienceItem;
