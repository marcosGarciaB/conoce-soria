import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { useAdmin } from "@/hooks/useAdmin";
import { UserCredentials, authService } from "@/services/authService";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
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
		"nombre" | "email" | "password" | "fotoPerfilUrl" | null
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
			fotoPerfilUrl: currentUser.fotoPerfilUrl,
		},
	});

	const openModal = (
		field: "nombre" | "email" | "password" | "fotoPerfilUrl"
	) => {
		setModalField(field);
		setModalVisible(true);

		if (field === "nombre") setValue("nombre", currentUser.nombre);
		if (field === "email") setValue("email", currentUser.email);
		if (field === "password") setValue("password", "");
		if (field === "fotoPerfilUrl")
			setValue("fotoPerfilUrl", currentUser.fotoPerfilUrl);
	};

	const saveModal = handleSubmit(async (data) => {
		if (!modalField) return;

		let updated: UserCredentials;

		try {
			if (modalField === "fotoPerfilUrl" && data.fotoPerfilUrl) {
				updated = await authService.changeProfilePhoto(
					token,
					data.fotoPerfilUrl
				);
			} else {
				updated = await authService.updateUserData(token, {
					[modalField]: data[modalField],
				});
			}

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
		<>
			<UserChips
				nombre={currentUser.nombre}
				email={currentUser.email}
				puntos={currentUser.puntos}
				fotoPerfil={currentUser.fotoPerfilUrl ?? ""}
				editPhoto={true}
				onPress={() => openModal("fotoPerfilUrl")}
			/>

			<View style={styles.actionButtons}>
				<Button
					title="Cambiar nombre"
					onPress={() => openModal("nombre")}
				/>
				<Button
					title="Cambiar correo"
					onPress={() => openModal("email")}
				/>
				<Button
					title="Cambiar contraseña"
					onPress={() => openModal("password")}
				/>
				<Button
					title="Política de privacidad"
					onPress={() => setPrivacyVisible(true)}
				/>

				<PrivacyModal
					isVisible={privacyVisible}
					onClose={() => setPrivacyVisible(false)}
				/>

				<Button title="Cerrar sesión" onPress={onPress} />
			</View>

			<ModalUpdate
				title={
					modalField === "nombre"
						? "Actualizar Nombre"
						: modalField === "email"
						? "Actualizar Email"
						: modalField === "password"
						? "Actualizar contraseña"
						: "Actualizar foto de perfil"
				}
				isVisible={modalVisible}
				onSave={saveModal}
				onClose={() => setModalVisible(false)}
				control={control}
				errors={errors}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	// Contenedores generales
	container: {
		flex: 1,
	},
	// Botones
	actionButtons: {
		width: "100%",
		gap: 10,
	},
});

export default Logged;
