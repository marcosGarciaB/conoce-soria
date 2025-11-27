import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Toast from "react-native-toast-message";
import EmailInput from "../components/inputs/EmailInput";
import NameInput from "../components/inputs/NameInput";
import PasswordInput from "../components/inputs/PasswordInput";
import { authService } from "../services/authService";

type FormData = {
	nombre: string;
	email: string;
	password: string;
};

const RegisterScreen = ({ navigation }: { navigation: any }) => {
	const [isLoading, setIsLoading] = useState(false);
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const handleRegister = async (data: FormData) => {
		setIsLoading(true);

		try {
			const exists = await authService.emailExists(data.email);

			if (exists) {
				Toast.show({
					type: "error",
					position: "top",
					text1: "Ya hay una cuenta existente con ese correo",
					visibilityTime: 2000,
					autoHide: true,
					topOffset: 60,
				});

			} else {
				try {
					await authService.register({
						nombre: data.nombre,
						email: data.email,
						password: data.password,
					});

					Toast.show({
						type: "success",
						position: "top",
						text1: "Registrado correctamente",
						visibilityTime: 2000,
						autoHide: true,
						topOffset: 60,
					});

					setTimeout(() => {
						navigation.navigate("Login");
					}, 3000);
				} catch (error) {
					console.error("Error en el registro:", error);
				}
			}

			} catch (error) {
				console.error("Error en el registro:", error);

			} finally {
				setIsLoading(false);
			}
		};

		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.innerContainer}>
					<View style={styles.formContainer}>
						<Text style={styles.title}>Crear Cuenta</Text>

						<View style={styles.inputContainer}>
							<NameInput control={control} errors={errors} />
						</View>

						<View style={styles.inputContainer}>
							<EmailInput control={control} errors={errors} />
						</View>

						<View style={styles.inputContainer}>
							<PasswordInput control={control} errors={errors} />
						</View>

						<TouchableOpacity
							style={styles.button}
							onPress={handleSubmit(handleRegister)}
							disabled={isLoading}
						>
							<Text style={styles.buttonText}>
								{isLoading ? "Registrando..." : "Registrarse"}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.buttonRegister}
							onPress={() => navigation.navigate("Login")}
						>
							<View style={styles.buttonWrapper}>
								<Text style={styles.buttonRegisterText}>
									Inicia Sesión
								</Text>
								<Ionicons
									name={"log-in-sharp"}
									size={20}
									color={"black"}
								/>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		);
	};

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: "#FAFAFA",
		},
		innerContainer: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			paddingHorizontal: 20,
			width: "100%",
		},
		formContainer: {
			width: "100%",
			maxWidth: 500,
			backgroundColor: "#f8f3f3ff",
			padding: 40,
			margin: 20,
			borderColor: "#d35800ff",
			borderWidth: 1,
			borderRadius: 10,
		},
		title: {
			fontSize: 26,
			fontWeight: "bold",
			color: "#d35800ff",
			textAlign: "center",
			marginBottom: 24,
		},
		// Botones
		buttonWrapper: {
			flexDirection: "row",
			alignItems: "center",
		},
		button: {
			backgroundColor: "#d35800ff",
			paddingVertical: 14,
			borderRadius: 50,
			alignItems: "center",
			marginTop: 30,
			marginBottom: 10,
		},
		buttonRegister: {
			backgroundColor: "#ffeddfff",
			borderColor: "#f79e5aff",
			borderWidth: 1,
			paddingVertical: 14,
			borderRadius: 50,
			alignItems: "center",
			marginBottom: 16,
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
		inputContainer: {
			marginBottom: 40,
		},
	});

	export default RegisterScreen;
