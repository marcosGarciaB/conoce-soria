import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	interpolateColor,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

import { useLoadUser } from "@/hooks/useLoadUser";
import { ComentariosResponse } from "@/services/commentService";
import ModalComment from "../modals/ModalComment";

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

	const { user } = useLoadUser();
	const isOwnComment = comentario.autorId === user?.id.toString();

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
		.enabled(isOwnComment)
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
		<View style={{ marginVertical: 5, margin: 10 }}>
			<GestureDetector gesture={panGesture}>

				<Animated.View style={[styles.commentItem, animatedStyle]}>
					<View style={styles.row}>

						<View style={styles.commentImageContainer}>
							<Image
								source={{ uri: comentario.autorFotoPerfil }}
								style={styles.commentImage}
								resizeMode="cover"
							/>
						</View>

						<View style={styles.commentContent}>
							<Text style={styles.commentUser}>{comentario.autorNombre}</Text>
							<Text style={styles.commentText}>{comentario.texto}</Text>
							<View style={styles.commentDateRow}>
								<Text style={styles.commentDate}>
									{new Date(comentario.fecha).toLocaleDateString()}
								</Text>
							</View>
						</View>

					</View>
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
		padding: 10,
		borderRadius: 25,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.15,
		shadowRadius: 5,
		elevation: 5,
		backgroundColor: "#fff",
	},
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 15,
	},
	commentImageContainer: {
		width: 45,
		height: 45,
		borderRadius: 22.5,
		overflow: "hidden",
		backgroundColor: "#eee",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.12,
		shadowRadius: 2,
		elevation: 2,
	},
	commentImage: {
		width: "100%",
		height: "100%",
	},
	commentContent: {
		flex: 1,
	},
	commentUser: {
		fontWeight: "600",
		fontSize: 15,
		color: "#181818"
	},
	commentText: {
		fontSize: 13,
		color: "#444",
		marginTop: 2
	},
	commentDateRow: {
		width: "100%",
		alignItems: "flex-end",
	},
	commentDate: {
		fontSize: 11,
		color: "#999",
	},

});

export default ComentarioItem;
