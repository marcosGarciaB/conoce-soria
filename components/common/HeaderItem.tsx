import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Header = ({ title, icon, isSecondIcon, icon2, onPress }: any) => {
	return (
		<View style={styles.wrapper}>
			<BlurView
				intensity={50}
				tint="light"
				style={styles.blurContainer}>

				<View style={styles.container}>
					{isSecondIcon && (
						<TouchableOpacity activeOpacity={0.85} onPress={onPress}>
							<Ionicons name={icon2} size={30} color="rgba(0, 0, 0, 0.7)" />
						</TouchableOpacity>
					)}

					<Text style={styles.title}>{title}</Text>

					<Ionicons name={icon} size={30} color="rgba(0, 0, 0, 0.7)" />
				</View>
			</BlurView>
		</View>

	);
};

const styles = StyleSheet.create({
	wrapper: {
		position: "absolute",
		top: 0,
		right: 0,
		left: 0,
		zIndex: 999,
		elevation: 999,
	},
	blurContainer: {
		width: "100%",
		overflow: "hidden",
	},
	container: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		height: 70,
		backgroundColor: "rgba(94, 94, 94, 0.15)",
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#5a5a5a",
	},
});

export default Header;
