import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { UserCredentials, authService } from "@/services/authService";
import { useForm } from "react-hook-form";
import UserChips from "../common/UserChips";
import InfoModal from "../modals/ModalInformation";
import ModalUpdate from "../modals/ModalUpdate";
import ModalWarning from "../modals/ModalWarning";
import { politica } from "../utils/modalsInformation";
import showSuccesToast from "../utils/showSuccesToast";
import Button from "./Button";

interface UserLogguedProps {
	user: UserCredentials;
	token: string;
	onPress: () => void;
}

const Logged = ({ token, user, onPress }: UserLogguedProps) => {
	const { logout } = useAuth();
	const [currentUser, setCurrentUser] = useState<UserCredentials>(user);
	const [modalVisible, setModalVisible] = useState<{
		politics: boolean;
		update: boolean;
		warning: boolean;
	}>({
		politics: false,
		update: false,
		warning: false,
	});

	const [modalField, setModalField] = useState<
		"nombre" | "email" | "password" | "fotoPerfilUrl" | null
	>(null);

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

	const openModal = async (
		field: "nombre" | "email" | "password" | "fotoPerfilUrl"
	) => {
		setModalField(field);

		if (field === "nombre") {
			setModalVisible({
				...modalVisible,
				update: true,
			});
			setValue("nombre", currentUser.nombre);
		}
		if (field === "email") {
			setModalVisible({
				...modalVisible,
				warning: true,
			});
			setValue("email", currentUser.email);
		}
		if (field === "password") {
			setModalVisible({
				...modalVisible,
				update: true,
			});
			setValue("password", "");
		}
		if (field === "fotoPerfilUrl") {
			setValue("fotoPerfilUrl", currentUser.fotoPerfilUrl);
			setModalVisible({
				...modalVisible,
				update: true,
			});
		}
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

			setModalVisible({
				...modalVisible,
				update: false,
			});
			setModalField(null);

			let campo = capitalizeFirstLetter(`${modalField}`.toString());

			if (campo === "Password") campo = "Contraseña";

			showSuccesToast(
				"Actualización exitosa",
				`${campo} actualizado correctamente`
			);

			if (modalField === "email") logout();
			
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
					onPress={() =>
						setModalVisible({
							...modalVisible,
							politics: true,
						})
					}
				/>

				<InfoModal
					visible={modalVisible.politics}
					title="Política de Privacidad"
					content={politica}
					onClose={() =>
						setModalVisible({
							...modalVisible,
							politics: false,
						})
					}
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
						? "Actualizar Contraseña"
						: "Actualizar foto de perfil"
				}
				isVisible={modalVisible.update}
				onSave={saveModal}
				onClose={() =>
					setModalVisible({
						...modalVisible,
						update: false,
					})
				}
				control={control}
				errors={errors}
			/>

			<ModalWarning
				isVisible={modalVisible.warning}
				title="Cambio Correo Electrónico"
				message="Al modificar la dirección de correo electrónico, será necesario iniciar sesión de nuevo"
				onClose={ () => 
					setModalVisible({
							...modalVisible,
							warning: false,
							update: true,
						})
				}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	actionButtons: {
		width: "100%",
		gap: 10,
	},
});

export default Logged;
