import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View } from "react-native";
import TabButton from "./TabButton";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
	state,
	descriptors,
	navigation,
}) => {
	return (
		<View style={styles.wrapper}>
			<BlurView
				intensity={50}
				tint="light"
				style={styles.blurContainer}
			>
				<View style={styles.container}>
					{state.routes.map((route, index) => {
						const focused = state.index === index;
						const iconName: keyof typeof Ionicons.glyphMap =
							route.name === "Inicio"
								? "home"
								: route.name === "Buscador"
									? "search"
									: route.name === "Profile"
										? "person"
										: route.name === "Top"
											? "trophy"
											: "apps";

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
			</BlurView>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
	},

	blurContainer: {
		width: "100%", 
		overflow: "hidden",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOpacity: 0.16,
		shadowOffset: { width: 0, height: 6 },
		shadowRadius: 12,
		elevation: 12,
	},
	container: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		height: 70,
		paddingHorizontal: 10,

		backgroundColor: "rgba(255,255,255,0.15)", // Ligera translucidez para ver el fondo
	},
});

export default CustomTabBar;
