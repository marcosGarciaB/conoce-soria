import UserForm from "@/components/admin/UserForm";
import Header from "@/components/common/HeaderItem";
import { useLoadUser } from "@/hooks/useLoadUser";
import { RootStackParamList } from "@/navigation/AppNavigator";

import { RouteProp } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UserRoute = RouteProp<RootStackParamList, "ManageUser">;

const ManageUserScreen = ({ navigation, route, }: { navigation: any; route: UserRoute; }) => {
	const user = route.params?.user;
	const { editingUser, loadEditingUser, handleSubmitForm } = useLoadUser();

	useEffect(() => {
		if (user?.email) {
			loadEditingUser(user.email);
			console.log(user.email);
		}
	}, [user]);

	return (
		<SafeAreaView style={styles.container}>
			<Header
				title="Creación de usuarios"
				icon="person-add-outline"
				isSecondIcon={true}
				icon2="chevron-back"
				onPress={() => navigation.goBack()}
			/>

			<View style={styles.formContainer}>

			<UserForm
				initialData={editingUser ?? undefined}
				onSubmit={handleSubmitForm}
				navigation={navigation}
			/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	formContainer: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 10,
		margin: 10,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3,
	},
});

export default ManageUserScreen;
