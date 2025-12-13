import { useAuth } from "@/contexts/AuthContext";
import { useRefresh } from "@/contexts/RefreshContext";
import { useUsers } from "@/contexts/UserContext";
import { useUserData } from "@/contexts/UserDataContext";
import { adminService, NewUser } from "@/services/adminService";
import { UpdateCredentials, UserCredentials } from "@/services/authService";
import { useCallback, useState } from "react";

export const useLoadUser = () => {
    const { token } = useAuth();

    const { user: currentUser, loadUser: reloadCurrentUser } = useUserData();
    const { users, reloadUsers } = useUsers();
    const { refreshUsers, refreshTop } = useRefresh();

    const [editingUser, setEditingUser] = useState<UserCredentials | null>(null);

    const loadEditingUser = async (email: string) => {
        if (!token) return;

        try {
            const data = await adminService.getUserByEmail(email, token);
            setEditingUser(data);
        } catch (error) {
            console.error("Error cargando el usuario:", error);
        }
    };

    const handleSubmitForm = useCallback(
        async (data: NewUser | UpdateCredentials) => {
            if (!token) return;

            try {
                if (editingUser) {
                    const updated = await adminService.updateUser(
                        editingUser.email,
                        data as UpdateCredentials,
                        token
                    );

                    setEditingUser(updated);

                    if (currentUser && updated.email === currentUser.email) {
                        await reloadCurrentUser();
                    }
                } else {
                    await adminService.createUser(data as NewUser, token);
                }

                refreshUsers();
                refreshTop();
            } catch (error) {
                console.error("Error guardando usuario", error);
            }
        },
        [token, editingUser, currentUser, reloadCurrentUser, refreshUsers, refreshTop]
    );

    return {
        users,
        editingUser,
        setEditingUser,
        loadEditingUser,
        handleSubmitForm
    };
};
