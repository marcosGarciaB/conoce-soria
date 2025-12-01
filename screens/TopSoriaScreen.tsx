import Header from "@/components/common/HeaderItem";
import UserChips from "@/components/profile/UserChips";
import { useAuth } from "@/contexts/AuthContext";
import { authService, UserCredentials } from "@/services/authService";
import { topService, UsuarioRankingDTO } from "@/services/topService";
import { Ionicons } from "@expo/vector-icons";

import React, { useEffect, useState } from "react";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const podiumColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

const TopSoriaScreen = () => {
	const { status, token } = useAuth();
	const isLogged = status === "authenticated";

	const [topUsuarios, setTopUsuarios] = useState<UsuarioRankingDTO[]>([]);
	const [user, setUser] = useState<UserCredentials>();
	const [loading, setLoading] = useState(true);
	const [userRank, setUserRank] = useState<number | null>(null);

	useEffect(() => {
		const loadUser = async () => {
			if (!token) return;
			try {
				const userData = await authService.getUserData(token);
				setUser(userData);
			} catch (error) {
				console.log(error);
			}
		};
		loadUser();
	}, [isLogged]);

	useEffect(() => {
		const loadRanking = async () => {
			try {
				const top = await topService.getRankingData();
				setTopUsuarios(top);

				if (user) {
					const pos = top.findIndex(
						(u) =>
							u.nombre === user.nombre || u.email === user.email
					);
					setUserRank(pos >= 0 ? pos + 1 : null);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		loadRanking();
	}, [user]);

	const renderCurrentUser = () => {
		if (!user) return null;
		return (
			<>
				<View style={{ width: "100%" }}>
					<UserChips
						nombre={user.nombre}
						email={user.email}
						puntos={user.puntos}
						userRank={userRank}
					/>
				</View>
			</>
		);
	};

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
			<Ionicons
				style={styles.userImage}
				name="person-circle"
				size={50}
				color="grey"
			/>
			<View style={styles.userInfo}>
				<Text style={styles.userName}>{item.nombre}</Text>
				<Text style={styles.userPoints}>{item.puntos} pts</Text>
			</View>
		</View>
	);

	const renderPodium = () => {
		return (
			<View style={styles.podiumContainer}>
				{topUsuarios.slice(0, 3).map((item, index) => (
					<View
						key={index}
						style={[
							styles.podiumCard,
							{ backgroundColor: podiumColors[index] },
						]}
					>
						<Ionicons name="person-circle" size={60} color="#fff" />
						<Text style={styles.podiumName}>{item.nombre}</Text>
						<Text style={styles.podiumPoints}>
							Puntos: {item.puntos}
						</Text>
						<View style={styles.rankBadge}>
							<Text style={styles.rankText}>{index + 1}</Text>
						</View>
					</View>
				))}
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header title="Ranking de Puestos" icon="trophy-outline" />

			<FlatList
				data={topUsuarios.slice(3)}
				keyExtractor={(item) => item.nombre}
				renderItem={renderItem}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
				
				ListHeaderComponent={
					<>
						{renderCurrentUser()}
						<Text style={styles.sectionTitle}>Clasificación</Text>
						{renderPodium()}
					</>
				}

                style={{marginBottom: "10%"}}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
		padding: 5,
	},
	listContent: {
		paddingHorizontal: 5,
	},
	// Podio
	podiumContainer: {
		flex: 20,
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 5,
		marginBottom: 20,
	},
	podiumCard: {
		width: width * 0.3,
		height: width * 0.4,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
		position: "relative",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 5,
	},
	podiumName: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 20,
		marginTop: 5,
		textAlign: "center",
	},
	podiumPoints: {
		color: "#fff",
		fontWeight: "500",
		fontSize: 13,
		marginTop: 2,
		textAlign: "center",
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: 20,
	},
	rankBadge: {
		position: "absolute",
		top: 0,
		right: 0,
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		borderColor: "black",
		borderWidth: 0.5,
	},
	rankText: {
		fontWeight: "bold",
		color: "black",
	},
	// Lista usuarios 4-10
	card: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 15,
		padding: 12,
		marginBottom: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 5,
	},
	rankCircle: {
		width: 35,
		height: 35,
		borderRadius: 18,
		backgroundColor: "#ffd9beff",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	userImage: {
		marginRight: 12,
	},
	userInfo: {
		flex: 1,
	},
	userName: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	userPoints: {
		fontSize: 14,
		color: "#777",
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#FF6B00",
		textTransform: "uppercase",
		backgroundColor: "white",
		width: "60%",
		padding: 10,
		marginTop: 20,
		marginVertical: 10,
		letterSpacing: 1,
		borderLeftWidth: 4,
		borderLeftColor: "#FF6B00",
		borderRadius: 25,
		paddingLeft: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 5,
	},
});

export default TopSoriaScreen;
