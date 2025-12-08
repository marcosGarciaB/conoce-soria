import React from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface GenerateUIDSectionProps {
	cantidad: string;
	onChangeCantidad: (value: string) => void;
	onGenerar: () => void;
	generating: boolean;
}

const GenerateUIDSection = ({
	cantidad,
	onChangeCantidad,
	onGenerar,
	generating,
}: GenerateUIDSectionProps) => (
	<View style={styles.generateSection}>
		<Text style={styles.sectionTitle}>Generar nuevos UIDs</Text>
		<View style={styles.inputContainer}>
			<TextInput
				style={styles.input}
				placeholder="Cantidad (1-100)"
				placeholderTextColor="#999"
				keyboardType="numeric"
				value={cantidad}
				onChangeText={onChangeCantidad}
			/>
			<TouchableOpacity
				style={[
					styles.generateButton,
					generating && styles.buttonDisabled,
				]}
				onPress={onGenerar}
				disabled={generating}
			>
				{generating ? (
					<ActivityIndicator color="white" />
				) : (
					<Text style={styles.generateButtonText}>Generar</Text>
				)}
			</TouchableOpacity>
		</View>
	</View>
);

const styles = StyleSheet.create({
	generateSection: {
		margin: 10,
		padding: 10,
		backgroundColor: "#ffffffff",
		borderRadius: 12,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#333",
		marginBottom: 12,
	},
	inputContainer: { 
		flexDirection: "row", 
		gap: 12 
	},
	input: {
		flex: 1,
		height: 50,
		backgroundColor: "white",
		borderColor: "#ffbf8bff",
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 12,
		fontSize: 16,
	},
	generateButton: {
		justifyContent: "center",
		backgroundColor: "#FF6B00",
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 10,
	},
	buttonDisabled: { 
		opacity: 0.6 
	},
	generateButtonText: { 
		color: "white", 
		fontWeight: "700", 
		fontSize: 16 
	},
});

export default GenerateUIDSection;
