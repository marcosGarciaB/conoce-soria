import LoadingScreen from "@/components/common/Loading";
import Ranking from "@/components/top/Ranking";
import { useLoadTop } from "@/hooks/useLoadTop";

import React from "react";

const TopSoriaScreen = () => {
	const { topUsuarios } = useLoadTop();

	if (!topUsuarios || topUsuarios.length === 0) return <LoadingScreen />;

	return <Ranking topUsuarios={topUsuarios} />;
};

export default TopSoriaScreen;
