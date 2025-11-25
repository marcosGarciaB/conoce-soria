import UserForm from "@/components/admin/UserForm";
import Header from "@/components/common/HeaderItem";
import { useAuth } from "@/contexts/AuthContext";
import { RootStackParamList } from "@/navigation/AppNavigator";
import { adminService, NewUser, UpdateCredentials, UserCredentials, } from "@/services/adminService";

import { RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type ExperienceRoute = RouteProp<RootStackParamList, "ManageUser">;

const ManageExperienceScreen = ({ navigation, route }: { navigation: any, route: ExperienceRoute }) => {
    const { token } = useAuth();
    const user = route.params?.user;
    const [editingUser, setEditingUser] = useState<UserCredentials | null>();
    const [users, setUsers] = useState<UserCredentials[]>([]);

    useEffect(() => {
        const loadUser = async () => {
            if (!token || !user) return;

            try {
                const data = await adminService.getUserByEmail(user.email, token);
                setEditingUser(data);
            } catch (error) {
                console.error("Error cargando experiencia:", error);
            }
        };
        loadUser();
    }, [user]);

    const handleSubmitForm = async (data: NewUser | UpdateCredentials) => {
        try {
            if (editingUser) {
                // Editar
                const updated = await adminService.updateUser(editingUser.email, data as UpdateCredentials, token!);
                setEditingUser(updated);
                // Actualizar la lista local de usuarios si tienes un listado
                setUsers((prev) =>
                    prev.map((u) => (u.email === updated.email ? updated : u))
                );
            } else {
                // Crear
                const created = await adminService.createUser(data as NewUser, token!);
                setUsers((prev) => [...prev, created]);
            }
        } catch (error) {
            console.error("Error guardando usuario", error);
        }
    };


    return (
        <View style={styles.container}>
            <Header title="Gestión usuarios" icon="home-outline" isSecondIcon={true} icon2="chevron-back-circle" onPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <UserForm
                    initialData={editingUser ?? undefined}
                    onSubmit={handleSubmitForm}
                    navigation={navigation}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA"
    },
    scrollContent: {
        flex: 1,                // Hace que ScrollView ocupe todo el espacio
        justifyContent: "center",   // Centra verticalmente
        alignItems: "center",       // Centra horizontalmente
        padding: 16,
    },
});

export default ManageExperienceScreen;
