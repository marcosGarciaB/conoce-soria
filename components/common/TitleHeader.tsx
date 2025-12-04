import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface TitleHeaderProps {
	title: string;
	onPress?: () => void;
}

const TitleHeader = ({ title, onPress }: TitleHeaderProps) => {
	return (
		<TouchableOpacity
			style={styles.container}
			onPress={onPress}
			activeOpacity={0.85}
		>
			<LinearGradient
				colors={["#e7e7e7ff", "#ffffffff", "#fffffe", "#e7e7e7ff"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.heroContainer}
			>
				<Text style={styles.title}>{title}</Text>
			</LinearGradient>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	heroContainer: {
		marginRight: 10,
		marginLeft: 10,
		paddingHorizontal: 20,
		paddingVertical: 15,
		borderRadius: 24,
	},
	title: {
		fontSize: 20,
		fontWeight: "800",
		color: "#1a1a1a",
		textAlign: "center",
	},
});

export default TitleHeader;
