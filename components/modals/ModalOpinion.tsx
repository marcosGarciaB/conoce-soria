import { useModalAnimation } from "@/components/animations/modalAnimation";
import React from "react";
import {
	ActivityIndicator,
	Animated,
	Keyboard,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface OpinionModalProps {
	visible: boolean;
	opinion: string;
	onOpinionChange: (text: string) => void;
	onRegister: () => void;
	onClose: () => void;
	registering: boolean;
}

const OpinionModal = ({
	visible,
	opinion,
	onOpinionChange,
	onRegister,
	onClose,
	registering,
}: OpinionModalProps) => {
	const { scale, opacity } = useModalAnimation(visible);

	const dismissKeyboard = () => Keyboard.dismiss();

	return (
		<Modal
			visible={visible}
			animationType="fade"
			transparent
			onRequestClose={() => {
				dismissKeyboard();
				onClose();
			}}
		>
			<TouchableWithoutFeedback onPress={dismissKeyboard}>
				<KeyboardAwareScrollView
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: "center",
					}}
					enableOnAndroid
					extraScrollHeight={60}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.modalOverlay}>
						<TouchableWithoutFeedback
							onPress={(e) => e.stopPropagation()}
						>
							<Animated.View
								style={[
									styles.modalContent,
									{ transform: [{ scale }], opacity },
								]}
							>
								<Text style={styles.modalTitle}>
									Registrar experiencia
								</Text>
								<Text style={styles.modalSubtitle}>
									Opcional: Comparte tu opinión sobre esta
									experiencia
								</Text>

								<TextInput
									style={styles.opinionInput}
									placeholder="Escribe tu opinión (máximo 1000 caracteres)"
									placeholderTextColor="#999"
									value={opinion}
									onChangeText={(text) => {
										if (text.length <= 1000)
											onOpinionChange(text);
									}}
									multiline
									numberOfLines={6}
									maxLength={1000}
								/>
								<Text style={styles.charCount}>
									{opinion.length}/1000 caracteres
								</Text>

								<View style={styles.modalButtons}>
									<TouchableOpacity
										style={[
											styles.modalButton,
											styles.registerButton,
										]}
										onPress={onRegister}
										disabled={registering}
									>
										{registering ? (
											<ActivityIndicator color="white" />
										) : (
											<Text
												style={styles.modalButtonText}
											>
												Registrar
											</Text>
										)}
									</TouchableOpacity>

									<TouchableOpacity
										style={[
											styles.modalButton,
											styles.cancelButton,
										]}
										onPress={onClose}
										disabled={registering}
									>
										<Text style={styles.modalButtonText}>
											Cancelar
										</Text>
									</TouchableOpacity>
								</View>
							</Animated.View>
						</TouchableWithoutFeedback>
					</View>
				</KeyboardAwareScrollView>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "white",
		borderRadius: 20,
		padding: 24,
		width: "85%",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 8,
		color: "#333",
	},
	modalSubtitle: {
		fontSize: 14,
		color: "#666",
		marginBottom: 16,
	},
	opinionInput: {
		width: "100%",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 10,
		padding: 12,
		marginBottom: 8,
		textAlignVertical: "top",
		minHeight: 120,
		fontSize: 16,
	},
	charCount: {
		fontSize: 12,
		color: "#999",
		textAlign: "right",
		marginBottom: 16,
	},
	modalButtons: {
		flexDirection: "row",
		gap: 12,
	},
	modalButton: {
		flex: 1,
		padding: 12,
		borderRadius: 10,
		alignItems: "center",
	},
	registerButton: {
		backgroundColor: "#FF6B00",
	},
	cancelButton: {
		backgroundColor: "#ccc",
	},
	modalButtonText: {
		color: "white",
		fontWeight: "700",
		fontSize: 16,
	},
});

export default OpinionModal;
