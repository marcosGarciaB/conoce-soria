import { useNavigation } from "@react-navigation/native";
import React from "react";

import LoadingScreen from "@/components/common/Loading";

import HeaderGeneral from "@/components/common/HeaderItem";
import PassportFlatlist from "@/components/passport/PassportFlatlist";
import { useLoadPassport } from "@/hooks/useLoadPassport";

const PassportScreen = () => {
	const navigation = useNavigation<any>();
	const { loadingPassport } = useLoadPassport();

	if (loadingPassport) return <LoadingScreen />;

	return (
		<>
			<HeaderGeneral
				title={"Pasaporte Personal"}
				icon="card-outline"
				icon2="chevron-back"
				onPress={() => navigation.goBack()}
				isSecondIcon={true}
			/>

			<PassportFlatlist />
		</>
	);
};

export default PassportScreen;