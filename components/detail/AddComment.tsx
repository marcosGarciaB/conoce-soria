import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

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
					<View style={styles.inputContainer}>
						<Ionicons
							name="chatbox"
							size={20}
							color="#ffbf8bff"
							style={{ marginRight: 8 }}
						/>
						<TextInput
							style={styles.inputWithIcon}
							placeholder="Escribe tu comentario"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
						/>
						<TouchableOpacity onPress={handleSubmit(onSubmit)}>
							<Ionicons name="send" size={25} color="#FF6B00" />
						</TouchableOpacity>
					</View>
				)}
			/>
			{errors.comentario && (
				<Text style={styles.errorText}>
					{errors.comentario.message}
				</Text>
			)}
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	// General
	addCommentContainer: {
		paddingVertical: 20,
	},
	// Inputs
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderColor: "#ffbf8bff",
		borderWidth: 1,
		borderRadius: 30,
		paddingHorizontal: 12,
		marginBottom: 10,
		marginTop: 10,
		backgroundColor: "white",
	},
	inputWithIcon: {
		flex: 1,
		height: 50,
		fontSize: 16,
		color: "#333",
	},
	// Error
	errorText: {
		color: "red",
		marginTop: 5,
	},
});

export default AddComment;
