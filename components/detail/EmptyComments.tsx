import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const EmptyComments = () => (
	<View style={styles.container}>
		<Ionicons name="chatbubble-ellipses-outline" size={40} color="#ccc" />
		<Text style={styles.text}>No hay comentarios aún</Text>
		<Text style={styles.subText}>
			Sé el primero en comentar tu experiencia
		</Text>
	</View>
);

const styles = StyleSheet.create({
	container: {
		paddingVertical: 40,
		paddingHorizontal: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		marginTop: 10,
		fontSize: 18,
		fontWeight: "500",
		color: "#666",
		textAlign: "center",
	},
	subText: {
		marginTop: 5,
		fontSize: 14,
		color: "#aaa",
		textAlign: "center",
	},
});

export default EmptyComments;
