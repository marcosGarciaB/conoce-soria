import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserUnLogguedProps {
	navigation: any;
}

const { height } = Dimensions.get("window");

const UnLogged = ({ navigation }: UserUnLogguedProps) => {
	return (
		<View style={styles.container}>
			<View style={styles.formContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.navigate("Login")}
				>
					<Text style={styles.buttonText}>Iniciar sesión</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.buttonRegister}
					onPress={() => navigation.navigate("Register")}
				>
					<View style={styles.buttonWrapper}>
						<Ionicons
							name={"person-add-sharp"}
							size={20}
							color={"black"}
						/>
						<Text style={styles.buttonRegisterText}>
							{" "}Crear Cuenta
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
	},
	formContainer: {
		position: "absolute",
		top: height / 4,
		width: "100%",
		maxWidth: 500,
		backgroundColor: "#f8f3f3ff",
		padding: 40,
		borderColor: "#7a7978ff",
		borderWidth: 1,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
	},
	buttonWrapper: {
		flexDirection: "row",
		alignItems: "center",
	},
	button: {
		backgroundColor: "#d35800ff",
		paddingVertical: 14,
		borderRadius: 50,
		alignItems: "center",
		marginBottom: 10,
	},
	buttonRegister: {
		backgroundColor: "#ffeddfff",
		borderColor: "#f79e5aff",
		borderWidth: 1,
		paddingVertical: 14,
		borderRadius: 50,
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
	buttonRegisterText: {
		color: "black",
		fontSize: 16,
	},
});

export default UnLogged;
