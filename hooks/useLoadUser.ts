import { useAuth } from "@/contexts/AuthContext";
import { adminService, NewUser } from "@/services/adminService";
import { authService, UpdateCredentials, UserCredentials } from "@/services/authService";
import { useEffect, useState } from "react";

export const useLoadUser = (userParam?: UserCredentials) => {
    const { status, token } = useAuth();
    const isLogged = status === "authenticated";
    const [user, setUser] = useState<UserCredentials | null>(null);
    const [editingUser, setEditingUser] = useState<UserCredentials | null>(null);
    const [users, setUsers] = useState<UserCredentials[]>([]);

    const loadUser = async () => {
        if (!token) return;
        try {
            const userData = await authService.getUserData(token);
            setUser(userData);
        } catch (error) {
            console.log(error);
        }
    };

    const loadEditingUser = async (email: string) => {	
        if (!token) return;

        try {
            const data = await adminService.getUserByEmail(email, token);
            setEditingUser(data);
        } catch (error) {
            console.error("Error cargando el usuario:", error);
        }
    }

    const handleSubmitForm = async (data: NewUser | UpdateCredentials) => {
        if (!token) return;

        try {
            if (editingUser) {
                const updated = await adminService.updateUser(editingUser.email, data as UpdateCredentials, token!);
                setEditingUser(updated);

                setUsers((prev) => prev.map((u) => (u.email === updated.email ? updated : u)));
            } else {
                const created = await adminService.createUser(data as NewUser, token!);
                setUsers((prev) => [...prev, created]);
            }
        } catch (error) {
            console.error("Error guardando usuario", error);
        }
    }

    useEffect(() => {
        loadUser();
    }, [token]);

    return {
        user,
        editingUser,
        setEditingUser,
        users,
        loadEditingUser,
        handleSubmitForm,
    }
}