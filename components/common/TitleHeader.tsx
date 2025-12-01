import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TitleHeaderProps {
	title: string;
	onPress?: () => void;
}

const TitleHeader = ({ title, onPress }: TitleHeaderProps) => {


	return (
		<TouchableOpacity
			style={styles.container}
			onPress={ (onPress) ? onPress : undefined }
			activeOpacity={0.85}
		>
			<View style={styles.accentBar} />
			<Text style={styles.title}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 14,
		backgroundColor: "rgba(255, 255, 255, 0.55)",
		borderRadius: 18,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.25)",
		shadowColor: "#000",
		shadowOpacity: 0.12,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 10,
		elevation: 7,
		marginTop: 20,
		marginBottom: 10,
		position: "relative",
		overflow: "hidden",
	},
	accentBar: {
		position: "absolute",
		left: 0,
		top: 0,
		height: "100%",
		width: 6,
		backgroundColor: "#FF6B00",
		borderTopLeftRadius: 18,
		borderBottomLeftRadius: 18,
		opacity: 0.9,
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		color: "#222",
	},
});

export default TitleHeader;
