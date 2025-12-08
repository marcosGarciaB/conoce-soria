import { ExperienciaUIDDTO } from "@/services/adminService";
import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UIDItemProps {
	uid: ExperienciaUIDDTO;
	onPressQR: (uidId: string) => void;
}

const UIDItem: FC<UIDItemProps> = ({ uid, onPressQR }) => {
	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("es-ES", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return dateString;
		}
	};

	return (
		<View style={styles.uidCard}>
			<View style={styles.uidHeader}>
				<View style={styles.uidInfo}>
					<Text style={styles.uidText}>{uid.uid}</Text>
					<View style={styles.statusContainer}>
						<View
							style={[
								styles.statusDot,
								uid.activo
									? styles.statusActive
									: styles.statusInactive,
							]}
						/>
						<Text style={styles.statusText}>
							{uid.activo ? "Activo" : "Inactivo"}
						</Text>
					</View>
				</View>
				<TouchableOpacity
					style={styles.qrButton}
					onPress={() => onPressQR(uid.id)}
				>
					<Ionicons
						name="qr-code-outline"
						size={24}
						color="#FF6B00"
					/>
				</TouchableOpacity>
			</View>
			<Text style={styles.dateText}>
				Generado: {formatDate(uid.fechaGeneracion)}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	uidCard: {
		backgroundColor: "white",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
	},
	uidHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	uidInfo: { 
		flex: 1 
	},
	uidText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 4,
		fontFamily: "monospace",
	},
	statusContainer: { 
		flexDirection: "row", 
		alignItems: "center", 
		gap: 6 
	},
	statusDot: { 
		width: 8, 
		height: 8, 
		borderRadius: 4 
	},
	statusActive: { 
		backgroundColor: "#28a745" 
	},
	statusInactive: { 
		backgroundColor: "#d9534f" 
	},
	statusText: { 
		fontSize: 12, 
		color: "#666" 
	},
	qrButton: { 
		padding: 8 
	},
	dateText: { 
		fontSize: 12, 
		color: "#999" 
	},
});

export default UIDItem;
