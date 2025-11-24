import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

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
		<View style={styles.headerPanel}>
			{isSecondIcon ? (
				<Ionicons
					style={{ marginLeft: 15 }}
					name={icon2}
					size={30}
					color={"orange"}
					onPress={onPress}
				/>
			) : (
				false
			)}

			<Text style={styles.title}>{title}</Text>
			<Ionicons
				style={{ marginRight: 15 }}
				name={icon}
				size={30}
				color={"orange"}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
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
		fontSize: 20,
		fontWeight: "bold",
		color: "#FF6B00",
		marginLeft: 20,
		maxWidth: 200,
	},
});

export default Header;
