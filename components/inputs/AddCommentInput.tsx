import useShakeAnimation from "@/components/animations/shakeAnimation";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
	Animated,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TextInput,
	TouchableOpacity
} from "react-native";
import showErrorToast from "../utils/showErrorToast";

interface FormData {
	comentario: string;
}

interface AddCommentProps {
	control: Control<FormData>;
	handleSubmit: any;
	onSubmit: (data: any) => void;
	errors: FieldErrors<FormData>;
}

const AddComment = ({
	control,
	handleSubmit,
	onSubmit,
	errors,
}: AddCommentProps) => {

	const { shakeAnim, shake } = useShakeAnimation();

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ width: "100%" }}
		>
			<Controller
				control={control}
				name="comentario"
				rules={{
					pattern: {
						value: /^[a-zA-Z0-9\s.,!¡?¿]*$/i,
						message: "Comentario no válido",
					},
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<Animated.View style={[styles.inputContainer,
							{ transform: [{ translateX: shakeAnim }] },
							errors.comentario && styles.inputError,
					]}
					>
						<Ionicons
							name="chatbox"
							size={20}
							color="#ffbf8bff"
							style={{ marginRight: 8 }}
						/>
						<TextInput
							style={styles.inputWithIcon}
							placeholder="Escribe tu comentario"
							onChangeText={onChange}
							value={value}
							onBlur={() => {
								onBlur;
								if (errors.comentario) {
									shake();
									showErrorToast(
										"Comentario no válido",
										errors.comentario.message!
									);
								}
							}}
						/>
						<TouchableOpacity onPress={handleSubmit(onSubmit)}>
							<Ionicons name="send" size={25} color="#FF6B00" />
						</TouchableOpacity>
					</Animated.View>
				)}
			/>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	// Inputs
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderColor: "#ffbf8bff",
		borderWidth: 1,
		borderRadius: 30,
		paddingHorizontal: 12,
		backgroundColor: "white",
		margin: 10,
	},
	inputWithIcon: {
		flex: 1,
		height: 50,
		fontSize: 16,
		color: "#333",
	},
	// Error
		inputError: {
		borderColor: "red",
		backgroundColor: "#ffe6e6",
	},
});

export default AddComment;
