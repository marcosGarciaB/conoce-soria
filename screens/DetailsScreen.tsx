import Header from "@/components/common/HeaderItem";
import LoadingScreen from "@/components/common/Loading";
import ComentarioItem from "@/components/detail/CommentItem";
import EmptyComments from "@/components/detail/EmptyComments";
import ExperienceDetail from "@/components/detail/ExperienceInfo";
import AddComment from "@/components/inputs/AddCommentInput";
import { useAuth } from "@/contexts/AuthContext";
import { useLoadComments } from "@/hooks/useLoadComments";
import { useLoadExperience } from "@/hooks/useLoadExperience";
import { RootStackParamList } from "@/navigation/AppNavigator";
import {
	ComentariosResponse,
	comentariosService,
} from "@/services/commentService";

import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
	FlatList,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	UIManager,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

if (Platform.OS === "android") {
	UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type DetailsRoute = RouteProp<RootStackParamList, "Details">;

type FormData = {
	comentario: string;
};

const DetailsScreen = ({
	navigation,
	route,
}: {
	navigation: any;
	route: DetailsRoute;
}) => {
	const { experiencia } = route.params;
	const { detalle } = useLoadExperience(experiencia.id);
	const { comentarios, loading, reload } = useLoadComments(experiencia.id);

	const [isLoading, setIsLoading] = useState(false);
	const { token } = useAuth();
	const listRef = useRef<FlatList<ComentariosResponse>>(null);

	const flatListRef = useRef<ScrollView>(null);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>();

	const onSubmit = async (data: FormData) => {
		if (!token) return <LoadingScreen />;

		setIsLoading(true);

		try {
			await comentariosService.setComentario(
				experiencia.id.toString(),
				{ texto: data.comentario },
				token
			);

			await reload();
			reset({ comentario: "" });

			setTimeout(() => {
				listRef.current?.scrollToEnd({ animated: true });
			}, 150);
		} catch (error) {
			console.error("Error al enviar comentario:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (comentarioId: string) => {
		if (!token) return <LoadingScreen />;
		setIsLoading(true);

		try {
			await comentariosService.deleteComentario(
				experiencia.id.toString(),
				comentarioId,
				token
			);

			await reload();
		} catch (error) {
			console.error("Error al enviar comentario:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdate = async (comentarioId: string, newText: string) => {
		if (!token) return <LoadingScreen />;
		setIsLoading(true);

		try {
			await comentariosService.updateComentario(
				experiencia.id.toString(),
				comentarioId,
				{ texto: newText },
				token
			);

			await reload();
		} catch (error) {
			console.error("Error al enviar comentario:", error);
		} finally {
			setIsLoading(false);
		}
	};

	if (!detalle) return <LoadingScreen />;

	return (
		<SafeAreaView style={styles.container}>
			<Header
				title={detalle.titulo}
				icon="search-sharp"
				isSecondIcon={true}
				icon2="chevron-back"
				onPress={() => navigation.goBack()}
			/>

			<ScrollView ref={flatListRef} showsVerticalScrollIndicator={false}>
				<ExperienceDetail detail={detalle} />

				<View>
					{comentarios.length === 0 ? (
						<EmptyComments />
					) : (
						comentarios.map((comentario) => (
							<ComentarioItem
								key={comentario.id}
								comentario={comentario}
								onDelete={(id) => handleDelete(id)}
								onUpdate={(id, newText) =>
									handleUpdate(id, newText)
								}
							/>
						))
					)}
				</View>

				<AddComment
					control={control}
					handleSubmit={handleSubmit}
					onSubmit={onSubmit}
					errors={errors}
				/>
				<TouchableOpacity
					style={styles.inputButton}
					onPress={() => console.log("Registrar experiencia")}
				>
					<Ionicons
						name="qr-code"
						size={30}
						color="white"
						style={{ marginRight: 10 }}
					/>
					<Text style={styles.buttonText}>Registrar experiencia</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	inputButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FF6B00",
		height: 50,
		borderRadius: 30,
		marginRight: 10,
		marginLeft: 10,
	},
	buttonText: {
		fontSize: 19,
		color: "white",
		fontWeight: "bold",
	},
});

export default DetailsScreen;
