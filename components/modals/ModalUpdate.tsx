import React from "react";
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Control, FieldErrors } from "react-hook-form";
import { useModalAnimation } from "../animations/modalAnimation";
import EmailInput from "../inputs/EmailInput";
import ImageUrlInput from "../inputs/ImageUrlInput";
import NameInput from "../inputs/NameInput";
import PasswordInput from "../inputs/PasswordInput";

interface ModalUpdateProps {
	title: string;
	isVisible: boolean;
	onSave: () => void;
	onClose: () => void;
	control: Control<any>;
	errors: FieldErrors<FormData>;
}

const ModalUpdate = ({
	title,
	isVisible,
	onSave,
	onClose,
	control,
	errors,
}: ModalUpdateProps) => {
	const { scale, opacity } = useModalAnimation(isVisible);

	return (
		<View>
			<Modal
				animationType="fade"
				transparent={true}
				visible={isVisible}
				onRequestClose={onClose}
			>
				<KeyboardAwareScrollView
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: "center",
					}}
					enableOnAndroid
					extraScrollHeight={60}
				>
					<View style={styles.modalOverlay}>
						<Animated.View style={[
							styles.modalContent,
							{
								transform: [{ scale }],
								opacity: opacity,
							},
						]}>
							<Text style={styles.modalTitle}>{title}</Text>

							<View style={styles.inputButton}>
								{title === "Actualizar Nombre" && (
									<NameInput
										control={control}
										errors={errors}
									/>
								)}

								{title === "Actualizar Email" && (
									<EmailInput
										control={control}
										errors={errors}
									/>
								)}

								{title === "Actualizar Contraseña" && (
									<PasswordInput
										control={control}
										errors={errors}
									/>
								)}

								{title === "Actualizar foto de perfil" && (
									<ImageUrlInput
										control={control}
										errors={errors}
										isProfilePhoto={true}
									/>
								)}
							</View>

							<View style={styles.modalButtons}>
								<TouchableOpacity
									style={styles.modalButton}
									onPress={onSave}
								>
									<Text style={styles.modalButtonText}>
										Guardar
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										styles.modalButton,
										styles.cancelButton,
									]}
									onPress={onClose}
								>
									<Text style={styles.modalButtonText}>
										Cancelar
									</Text>
								</TouchableOpacity>
							</View>
						</Animated.View>
					</View>
				</KeyboardAwareScrollView>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#fff",
		borderRadius: 28,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 12 },
		shadowOpacity: 0.3,
		shadowRadius: 25,
		elevation: 15,
	},
	inputButton: {
		width: "95%",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	modalButton: {
		flex: 1,
		backgroundColor: "#FF6B00",
		padding: 12,
		borderRadius: 8,
		marginHorizontal: 5,
		alignItems: "center",
	},
	cancelButton: {
		backgroundColor: "#ccc",
	},
	modalButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});

export default ModalUpdate;
