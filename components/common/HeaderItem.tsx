import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text } from "react-native";

const Header = ({
	title,
	icon,
	isSecondIcon,
	icon2,
	onPress,
}: any) => {
	return (
		<LinearGradient
			colors={["#ffffff", "#f7efe8", "#f7e9d9ff"]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={stylesGR.container}
		>
			{isSecondIcon && (
				<Ionicons
					name={icon2}
					size={30}
					color="#5a5a5a"
					onPress={onPress}
				/>
			)}

			<Text style={stylesGR.title}>{title}</Text>

			<Ionicons name={icon} size={30} color="#5a5a5a" />
		</LinearGradient>
	);
};

const stylesGR = StyleSheet.create({
	container: {
		height: 65,
		borderRadius: 25,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		elevation: 8,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 20,
		marginBottom: 10,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#5a5a5a",
		textShadowColor: "#ffffff",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 4,
	},
});

export default Header;
