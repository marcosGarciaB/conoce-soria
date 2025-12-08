import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const OverlayQR = () => {
	return (
		<>
			<View style={styles.overlay} pointerEvents="none">
				<View style={styles.scanArea}>
					<View style={[styles.corner, styles.topLeft]} />
					<View style={[styles.corner, styles.topRight]} />
					<View style={[styles.corner, styles.bottomLeft]} />
					<View style={[styles.corner, styles.bottomRight]} />
				</View>
				<Text style={styles.instructionText}>
					Apunta la cámara al código QR
				</Text>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent",
		justifyContent: "center",
		alignItems: "center",
		pointerEvents: "none",
	},
	scanArea: {
		width: 250,
		height: 250,
		position: "relative",
	},
	corner: {
		position: "absolute",
		width: 30,
		height: 30,
		borderColor: "#FF6B00",
	},
	topLeft: {
		top: 0,
		left: 0,
		borderTopWidth: 4,
		borderLeftWidth: 4,
	},
	topRight: {
		top: 0,
		right: 0,
		borderTopWidth: 4,
		borderRightWidth: 4,
	},
	bottomLeft: {
		bottom: 0,
		left: 0,
		borderBottomWidth: 4,
		borderLeftWidth: 4,
	},
	bottomRight: {
		bottom: 0,
		right: 0,
		borderBottomWidth: 4,
		borderRightWidth: 4,
	},
	instructionText: {
		color: "white",
		fontSize: 16,
		marginTop: 30,
		textAlign: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
		padding: 12,
		borderRadius: 8,
	},
});
