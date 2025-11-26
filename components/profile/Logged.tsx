import React, { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { useAdmin } from "@/hooks/useAdmin";
import { UserCredentials, authService } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import Header from "../common/HeaderItem";
import ModalUpdate from "./ModalUpdate";
import PrivacyModal from "./PrivacyModal";

interface UserLogguedProps {
	user: UserCredentials;
	token: string;
	onPress: () => void;
}

const Logged = ({ token, user, onPress }: UserLogguedProps) => {
	const [currentUser, setCurrentUser] = useState<UserCredentials>(user);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalField, setModalField] = useState<
		"nombre" | "email" | "password" | null
	>(null);
	const [privacyVisible, setPrivacyVisible] = useState(false);
	const isAdminUser = useAdmin(token);

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: {
			nombre: currentUser.nombre,
			email: currentUser.email,
			password: "",
		},
	});

	const openModal = (field: "nombre" | "email" | "password") => {
		setModalField(field);
		setModalVisible(true);

		if (field === "nombre") setValue("nombre", currentUser.nombre);
		if (field === "email") setValue("email", currentUser.email);
		if (field === "password") setValue("password", "");
	};

	const saveModal = handleSubmit(async (data) => {
		if (!modalField) return;

		try {
			const updated = await authService.updateUserData(token, {
				[modalField]: data[modalField],
			});
			setCurrentUser({
				...currentUser,
				[modalField]: updated[modalField],
			});
			setModalVisible(false);
			setModalField(null);

			let campo = capitalizeFirstLetter(`${modalField}`.toString());

			if (campo === "Password") campo = "Contraseña";

			Toast.show({
				type: "success",
				text1: "Actualización exitosa",
				text2: `${campo} actualizado correctamente`,
				position: "bottom",
				bottomOffset: 100,
				visibilityTime: 3000,
				autoHide: true,
			});
		} catch (error) {
			console.error(error);
		}
	});

	function capitalizeFirstLetter(str: string): string {
		if (!str) {
			return "";
		}
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	return (
		<View>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<Header title="Mi Cuenta" icon="information-circle-outline" />

				<View style={styles.profileContainer}>
					<Ionicons name="person-circle" size={120} color="#FF6B00" />
					<Text style={styles.profileName}>{currentUser.nombre}</Text>
					<Text style={styles.profileEmail}>{currentUser.email}</Text>

					<View style={styles.infoChips}>
						<View style={styles.chip}>
							<Text style={styles.chipText}>
								Puntos: {currentUser.puntos}
							</Text>
						</View>
					</View>

					<View style={styles.actionButtons}>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => openModal("nombre")}
						>
							<Text style={styles.actionText}>
								Cambiar nombre
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => openModal("email")}
						>
							<Text style={styles.actionText}>
								Cambiar correo
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => openModal("password")}
						>
							<Text style={styles.actionText}>
								Cambiar contraseña
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => setPrivacyVisible(true)}
						>
							<Text style={styles.actionText}>
								Política de privacidad
							</Text>
						</TouchableOpacity>

						<PrivacyModal
							isVisible={privacyVisible}
							onClose={() => setPrivacyVisible(false)}
						/>

						<TouchableOpacity
							style={[
								styles.actionButton,
								{ backgroundColor: "#FF6B00" },
							]}
							onPress={onPress}
						>
							<Text
								style={[styles.actionText, { color: "white" }]}
							>
								Cerrar sesión
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>

			<ModalUpdate
				title={
					modalField === "nombre"
						? "Actualizar Nombre"
						: modalField === "email"
						? "Actualizar Email"
						: "Actualizar Contraseña"
				}
				isVisible={modalVisible}
				onSave={saveModal}
				onClose={() => setModalVisible(false)}
				control={control}
				errors={errors}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	// Contenedores generales
	scrollContent: {
		padding: 5,
	},
	// Botones
	actionButtons: {
		width: "100%",
		gap: 10,
	},
	actionButton: {
		backgroundColor: "#fff",
		paddingVertical: 15,
		borderRadius: 15,
		alignItems: "center",
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
	},
	// Perfil
	profileContainer: {
		alignItems: "center",
		paddingVertical: 20,
	},
	profileName: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		marginTop: 10,
	},
	profileEmail: {
		fontSize: 16,
		color: "grey",
		marginBottom: 20,
	},
	// Chips
	infoChips: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
		marginBottom: 30,
	},
	chip: {
		backgroundColor: "#ffe6d5",
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: 20,
	},
	chipText: {
		color: "#FF6B00",
		fontWeight: "bold",
	},
	actionText: {
		fontSize: 16,
		color: "#333",
		fontWeight: "bold",
	},
});

export default Logged;
