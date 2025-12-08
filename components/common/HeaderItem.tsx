import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_HEIGHT = 56;

const HeaderGeneral = ({ title, icon2, onPress }: any) => {
	const { top } = useSafeAreaInsets();

	return (
		<BlurView intensity={90} tint="light" style={{ paddingTop: top }}>
			<View style={styles.container}>
				<View style={styles.side}>
					{icon2 && (
						<TouchableOpacity activeOpacity={0.8} onPress={onPress}>
							<Ionicons name={icon2} size={26} color="#333" />
						</TouchableOpacity>
					)}
				</View>

				<Text style={styles.title} numberOfLines={2}>
					{title}
				</Text>

				<View style={styles.side} />
			</View>
		</BlurView>
	);
};

const styles = StyleSheet.create({
	container: {
		height: HEADER_HEIGHT,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		backgroundColor: "rgba(255, 255, 255, 0.7)",
		borderBottomColor: "rgba(0,0,0,0.05)",
		borderBottomWidth: 1,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3,
	},
	side: {
		width: 32,
		alignItems: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		color: "#111",
		textAlign: "center",
		flex: 1,
	},
});

export default HeaderGeneral;
