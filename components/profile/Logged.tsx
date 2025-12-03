import React, { useState } from "react";
import {
	StyleSheet,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAdmin } from "@/hooks/useAdmin";
import { UserCredentials, authService } from "@/services/authService";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import Header from "../common/HeaderItem";
import UserChips from "../common/UserChips";
import Button from "./Button";
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
		<SafeAreaView style={styles.container}>
				<Header title="Mi Cuenta" icon="information-circle-outline" />


				<UserChips nombre={currentUser.nombre} email={currentUser.email} puntos={currentUser.puntos} fotoPerfil={currentUser.fotoPerfilUrl} />

				<View style={styles.profileContainer}>
					<View style={styles.actionButtons}>

						<Button title="Cambiar nombre" onPress={() => openModal("nombre")} />
						<Button title="Cambiar correo" onPress={() => openModal("email")} />
						<Button title="Cambiar contraseña" onPress={() => openModal("password")} />
						<Button title="Política de privacidad" onPress={() => setPrivacyVisible(true)} />

						<PrivacyModal
							isVisible={privacyVisible}
							onClose={() => setPrivacyVisible(false)}
						/>

						<Button title="Cerrar sesión" onPress={onPress} />
					</View>
				</View>

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
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	// Contenedores generales
	container: {
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
