import LoadingScreen from "@/components/common/Loading";
import UIDItem from "@/components/uid/UIDItem";
import { ExperienciaUIDDTO } from "@/services/adminService";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useStaggeredItemAnimation } from "../animations/staggeredItemAnimation";

interface UIDListProps {
	uids: ExperienciaUIDDTO[];
	loading: boolean;
	onPressQR: (uidId: string) => void;
}

const UIDList = ({ uids, loading, onPressQR }: UIDListProps) => {
	if (loading) return <LoadingScreen />;

	if (uids.length === 0)
		return (
			<View style={styles.emptyContainer}>
				<Text style={styles.emptyText}>No hay UIDs generados aún</Text>
			</View>
		);

	return (
		<FlatList
			data={uids}
			keyExtractor={(item) => item.id}
			contentContainerStyle={{
				padding: 10,
			}}
			renderItem={({ item, index }) => {
				const { entering } = useStaggeredItemAnimation(index);

				return (
					<Animated.View entering={entering}>
						<UIDItem uid={item} onPressQR={onPressQR} />
					</Animated.View>
				);
			}}
		/>
	);
};

const styles = StyleSheet.create({
	emptyContainer: {
		alignItems: "center",
		justifyContent: "center",
		padding: 40,
	},
	emptyText: { 
		fontSize: 16, 
		color: "#999" 
	},
});

export default UIDList;
