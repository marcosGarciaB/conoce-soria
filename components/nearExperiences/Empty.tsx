import { StyleSheet, Text, View } from "react-native";
import HeaderGeneral from "../common/HeaderItem";
import LoadingScreen from "../common/Loading";

interface EmptyProps {
	loading: boolean;
	onPress: () => void;
}

const Empty = ({ loading, onPress }: EmptyProps) => {
	if (loading) {
		return (
			<>
				<HeaderGeneral
					title="Experiencias cercanas"
					icon="chevron-back"
					onPress={onPress}
				/>
				<LoadingScreen />
			</>
		);
	} else {
		return (
			<>
				<HeaderGeneral
					isSecondIcon={true}
					icon2="chevron-back"
					onPress={onPress}
				/>
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>
						No se encontraron experiencias cercanas
					</Text>
				</View>
			</>
		);
	}
};

const styles = StyleSheet.create({
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		paddingTop: 56,
	},
	emptyText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
});

export default Empty;
