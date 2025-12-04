import { useLoadUser } from "@/hooks/useLoadUser";
import { UsuarioRankingDTO } from "@/services/topService";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
	Animated,
	Dimensions,
	FlatList,
	StyleSheet,
	Text,
	View,
} from "react-native";
import ProfileAvatar from "../common/ProfilePhoto";
import TitleHeader from "../common/TitleHeader";
import InfoModal from "../modals/ModalInformation";
import { normasContenido, premioContenido } from "../utils/modalsInformation";
import ButtonInformation from "./Buttons";
import CurrentUser from "./CurrentUser";

interface RankingProps {
	topUsuarios: UsuarioRankingDTO[];
	navigation?: any;
	isHome?: boolean;
}

const { width } = Dimensions.get("screen");

const podiumColors = [
	["#FFD700", "#FFE066", "#FFD700"],
	["#C0C0C0", "#E0E0E0", "#C0C0C0"],
	["#CD7F32", "#E3A869", "#CD7F32"],
];

const Ranking = ({ topUsuarios, navigation, isHome }: RankingProps) => {
	const { user } = useLoadUser();
	const [modalVisible, setModalVisible] = useState<{
		rules: boolean;
		prize: boolean;
	}>({
		rules: false,
		prize: false,
	});

	const renderItem = ({
		item,
		index,
	}: {
		item: UsuarioRankingDTO;
		index: number;
	}) => (
		<View style={styles.card}>
			<View style={styles.rankCircle}>
				<Text style={styles.rankText}>{index + 4}</Text>
			</View>
			
			<ProfileAvatar foto={item.fotoPerfilUrl} size={50} />

			<View style={styles.userInfo}>
				<Text style={styles.userName}>{item.nombre}</Text>
				<Text style={styles.userPoints}>{item.puntos} pts</Text>
			</View>
		</View>
	);

	const renderPodium = () => (
		<View style={styles.podiumContainer}>
			{topUsuarios.slice(0, 3).map((item, index) => {
				return (
					<Animated.View key={index} style={styles.podiumCard}>
						<LinearGradient
							colors={
								podiumColors[index] as [string, string, string]
							}
							style={styles.podiumGradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
						>
							<ProfileAvatar
								foto={item.fotoPerfilUrl}
								size={70}
							/>
							<Text style={styles.podiumName}>{item.nombre}</Text>
							<Text style={styles.podiumPoints}>
								{item.puntos} pts
							</Text>
							<View style={styles.rankBadge}>
								<Text style={styles.rankText}>{index + 1}</Text>
							</View>
						</LinearGradient>
					</Animated.View>
				);
			})}
		</View>
	);

	return (
		<>
			{isHome ? (
				<>
					<TitleHeader
						title="Mejores Puntuaciones"
						onPress={() => navigation.navigate("Top")}
					/>
					{renderPodium()}
				</>
			) : (
				<FlatList
					data={topUsuarios.slice(3)}
					keyExtractor={(item) => item.nombre}
					renderItem={renderItem}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
					ListHeaderComponent={
						<>
							<CurrentUser />

							<TitleHeader title="Mejores Clasificados" />
							{renderPodium()}
						</>
					}
					style={{ marginBottom: "10%" }}
					ListFooterComponent={
						<View style={styles.container}>
							<View style={styles.buttonRow}>
								<ButtonInformation
									title="Normas del Juego"
									onPress={() =>
										setModalVisible({
											...modalVisible,
											rules: true,
										})
									}
								/>
								<ButtonInformation
									title="Premio del Mes"
									onPress={() =>
										setModalVisible({
											...modalVisible,
											prize: true,
										})
									}
								/>
							</View>

							<InfoModal
								visible={modalVisible.rules}
								title="Normas del Juego"
								content={normasContenido}
								onClose={() =>
									setModalVisible({
										...modalVisible,
										rules: false,
									})
								}
							/>

							<InfoModal
								visible={modalVisible.prize}
								title="Premio Mensual"
								content={premioContenido}
								onClose={() =>
									setModalVisible({
										...modalVisible,
										prize: false,
									})
								}
							/>
						</View>
					}
				/>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	listContent: {
		paddingHorizontal: 10,
	},
	card: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 16,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.12,
		shadowRadius: 20,
		elevation: 10,
		borderWidth: 0.5,
		borderColor: "rgba(0,0,0,0.05)",
	},
	rankCircle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#eeeeeeff",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 5,
	},
	userImage: {
		marginRight: 16,
	},
	userInfo: {
		flex: 1,
	},
	userName: {
		fontSize: 18,
		fontWeight: "700",
		color: "#222",
	},
	userPoints: {
		fontSize: 14,
		color: "#888",
		marginTop: 2,
	},
	podiumContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 15,
		marginBottom: 30,
	},
	podiumCard: {
		width: width * 0.3,
		height: width * 0.45,
		borderRadius: 25,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 15,
		elevation: 12,
	},
	podiumGradient: {
		flex: 1,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#aaa",
		padding: 12,
	},
	podiumName: {
		color: "#444",
		fontWeight: "800",
		fontSize: 20,
		marginTop: 8,
		textAlign: "center",
		textShadowColor: "rgba(255,255,255,0.3)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 4,
	},
	podiumPoints: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 14,
		marginTop: 6,
		textAlign: "center",
		paddingHorizontal: 14,
		paddingVertical: 6,
		borderRadius: 16,
		backgroundColor: "rgba(0,0,0,0.25)",
	},
	rankBadge: {
		position: "absolute",
		top: 0,
		right: 0,
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		borderColor: "#f8f5e6ff",
		borderWidth: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 5,
	},
	rankText: {
		fontWeight: "800",
		color: "#333",
		fontSize: 16,
	},
	buttonRow: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-around",
	},
});

export default Ranking;
