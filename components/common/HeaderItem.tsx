import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text } from "react-native";

interface HeaderProps {
	title: string;
	icon: keyof typeof Ionicons.glyphMap;
	isSecondIcon?: boolean;
	icon2?: keyof typeof Ionicons.glyphMap;
	onPress?: () => void;
	navigation?: any;
}

const Header = ({
	title,
	icon,
	isSecondIcon,
	icon2,
	onPress,
	navigation,
}: HeaderProps) => {
	return (
		<>

			<LinearGradient
				colors={["#ffffffff", "#faebd7ff"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={styles.headerPanel}
			>
				{isSecondIcon ? (
					<Ionicons
						style={{ marginLeft: 15 }}
						name={icon2}
						size={30}
						color={"#5e5e5eff"}
						onPress={onPress}
					/>
				) : null}

				<Text style={[isSecondIcon ? styles.title1 : styles.title2]}>
					{title}
				</Text>

				<Ionicons
					style={{ marginRight: 15 }}
					name={icon}
					size={30}
					color={"#5e5e5eff"}
				/>
			</LinearGradient>

		</>
	);
};

const styles = StyleSheet.create({
	headerPanel: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		elevation: 5,
		borderRadius: 30,
		marginBottom: 5,
		height: 60,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		paddingHorizontal: 10,
	},
	title1: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#5e5e5eff",
		maxWidth: 200,
	},
	title2: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#5e5e5eff",
		marginLeft: 25,
		maxWidth: 200,
	},
});

export default Header;
