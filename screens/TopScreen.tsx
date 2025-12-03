import Header from "@/components/common/HeaderItem";
import Ranking from "@/components/top/Ranking";
import { useLoadTop } from "@/hooks/useLoadTop";

import React from "react";
import {
	StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TopSoriaScreen = () => {
	const { topUsuarios } = useLoadTop();

	return (
		<SafeAreaView style={styles.container}>
			<Header title="Ranking de Puestos" icon="trophy-outline" />
			<Ranking topUsuarios={topUsuarios} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
		padding: 5,
	},
});

export default TopSoriaScreen;
