import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, View } from "react-native";
import TabButton from "./TabButton";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
	state,
	descriptors,
	navigation,
}) => {
	return (
		<View style={styles.container}>
			{state.routes.map((route, index) => {
				const focused = state.index === index;
				const iconName: keyof typeof Ionicons.glyphMap =
					route.name === "Inicio"
						? "home-outline"
						: route.name === "Buscador"
						? "search-outline"
						: route.name === "Profile"
						? "person"
						: "accessibility";

				return (
					<TabButton
						key={route.key}
						iconName={iconName}
						focused={focused}
						onPress={() => navigation.navigate(route.name)}
					/>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-around",
		position: "absolute",
		bottom: 20,
		left: 0,
		right: 0,
		marginHorizontal: 5,
		backgroundColor: "white",
		borderRadius: 30,
		height: 60,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
		alignItems: "center",
	},
});

export default CustomTabBar;
