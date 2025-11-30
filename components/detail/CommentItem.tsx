import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	interpolateColor,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

import { ComentariosResponse } from "@/services/commentService";
import ModalComment from "./ModalComment";

interface ComentarioItemProps {
	comentario: ComentariosResponse;
	onDelete?: (id: string) => void;
	onUpdate?: (id: string, newText: string) => void;
}

const MAX = 50;
const THRESHOLD = MAX * 0.25;

const ComentarioItem: React.FC<ComentarioItemProps> = ({
	comentario,
	onDelete,
	onUpdate,
}) => {
	const translate = useSharedValue(0);
	const [modalVisible, setModalVisible] = useState(false);
	const [actionType, setActionType] = useState<"delete" | "update" | null>(
		null
	);

	const resetPosition = () => {
		translate.value = withSpring(0, { damping: 15, stiffness: 120 });
	};

	const triggerAction = (type: "delete" | "update") => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		setActionType(type);
		setModalVisible(true);
		resetPosition();
	};

	const panGesture = Gesture.Pan()
		.onUpdate((e) => {
			translate.value = Math.max(-MAX, Math.min(e.translationX, MAX));
		})
		.onEnd(() => {
			const value = translate.value;

			if (value >= THRESHOLD) {
				runOnJS(triggerAction)("update");
			} else if (value <= -THRESHOLD) {
				runOnJS(triggerAction)("delete");
			} else {
				resetPosition();
			}
		});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translate.value }],
		backgroundColor: interpolateColor(
			translate.value,
			[-MAX, 0, MAX],
			["#ffcccc", "#ffffff", "#e5f2ff"]
		),
	}));

	const handleConfirm = (newText?: string) => {
		if (actionType === "delete" && onDelete) onDelete(comentario.id);
		if (actionType === "update" && onUpdate && newText)
			onUpdate(comentario.id, newText);
		setModalVisible(false);
		setActionType(null);
	};

	const handleCancel = () => {
		setModalVisible(false);
		setActionType(null);
	};

	return (
		<View style={{ marginVertical: 8 }}>
			<GestureDetector gesture={panGesture}>
				<Animated.View style={[styles.commentItem, animatedStyle]}>
					<Text style={styles.commentUser}>
						{comentario.autorNombre}
					</Text>
					<Text style={styles.commentText}>{comentario.texto}</Text>
					<Text style={styles.commentDate}>
						{new Date(comentario.fecha).toLocaleString()}
					</Text>
				</Animated.View>
			</GestureDetector>

			<ModalComment
				title={
					actionType === "delete"
						? "Eliminar comentario"
						: "Editar comentario"
				}
				isVisible={modalVisible}
				onSave={handleConfirm}
				onClose={handleCancel}
				initialText={comentario.texto}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	commentItem: {
		padding: 15,
		borderRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.15,
		shadowRadius: 5,
		elevation: 5,
		backgroundColor: "#fff",
	},
	commentUser: { 
		fontWeight: "600", 
		color: "#333" 
	},
	commentText: { 
		color: "#555", 
		marginTop: 4 
	},
	commentDate: {
		color: "#777",
		fontSize: 12,
		marginTop: 4,
		alignSelf: "flex-end",
	},
});

export default ComentarioItem;
