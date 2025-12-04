import { NewUser } from "@/services/adminService";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { UserCredentials } from "@/services/authService";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ActiveInput from "../inputs/ActiveInput";
import EmailInput from "../inputs/EmailInput";
import ImageUrlInput from "../inputs/ImageUrlInput";
import NameInput from "../inputs/NameInput";
import PasswordInput from "../inputs/PasswordInput";
import RoleInput from "../inputs/RoleInput";
import ModalSuccess from "../modals/ModalSucces";

interface UserFormProps {
	initialData?: UserCredentials;
	onSubmit: (data: NewUser | UserCredentials) => void;
	navigation: any;
}

const UserForm = ({ initialData, onSubmit, navigation }: UserFormProps) => {
	const [showSuccess, setShowSuccess] = useState(false);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			nombre: "",
			email: "",
			password: "",
			role: "USER",
			fotoPerfilUrl: "",
			activo: true,
		},
	});

	useEffect(() => {
		if (initialData) {
			reset({
				nombre: initialData.nombre,
				email: initialData.email,
				password: initialData.password,
				role: initialData.role,
				activo: initialData.activo ?? true,
				fotoPerfilUrl: initialData.fotoPerfilUrl,
			});
		}
	}, [initialData]);

	const submitHandler = (data: any) => {
		if (initialData) {
			const updatedData: UserCredentials = {
				id: initialData.id,
				nombre: data.nombre,
				email: data.email,
				password: data.password || initialData.password,
				role: data.role,
				puntos: initialData.puntos,
				fechaCreacion: initialData.fechaCreacion,
				fotoPerfilUrl: data.fotoPerfilUrl || initialData.fotoPerfilUrl,
				activo: data.activo !== undefined ? data.activo : initialData.activo,
			};
			onSubmit(updatedData);

		} else {
			const newData: NewUser = {
				nombre: data.nombre,
				email: data.email,
				password: data.password,
				role: data.role,
				fotoPerfilUrl: data.fotoPerfilUrl,
			};
			onSubmit(newData);
		}
		setShowSuccess(true);
	};

	return (
		<KeyboardAwareScrollView
			enableOnAndroid={true}
			keyboardShouldPersistTaps="handled"
		>
			<NameInput control={control} errors={errors} />
			<EmailInput control={control} errors={errors} />
			<PasswordInput
				control={control}
				errors={errors}
				initialData={!!initialData}
			/>
			<RoleInput control={control} errors={errors} />
			<ImageUrlInput control={control} errors={errors} isProfilePhoto={true} />
			<ActiveInput control={control} errors={errors} />

			<TouchableOpacity
				style={styles.submitButton}
				onPress={handleSubmit(submitHandler)}
			>
				<Text style={styles.submitText}>
					{initialData ? "Actualizar Usuario" : "Crear Usuario"}
				</Text>
			</TouchableOpacity>

			<ModalSuccess
				title={
					initialData ? "¡Usuario actualizado!" : "¡Usuario creado!"
				}
				message={
					initialData
						? "El usuario se ha actualizado correctamente."
						: "El usuario se ha creado correctamente."
				}
				isVisible={showSuccess}
				onClose={() => {
					setShowSuccess(false);
					navigation.goBack();
				}}
			/>
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	submitButton: {
		backgroundColor: "#FF6B00",
		paddingVertical: 14,
		borderRadius: 12,
		marginTop: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 3 },
	},
	submitText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
		letterSpacing: 0.5,
	},
});

export default UserForm;
