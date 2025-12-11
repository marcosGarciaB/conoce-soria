import { authService, UserCredentials } from "@/services/authService";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { useRefresh } from "./RefreshContext";

interface UsersContextProps {
    users: UserCredentials[];
    loading: boolean;
    reloadUsers: () => void;
}

const UsersContext = createContext<UsersContextProps>({
    users: [],
    loading: false,
    reloadUsers: () => { },
});

export const UsersProvider = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAuth();
    const { subscribeUsers } = useRefresh();

    const [users, setUsers] = useState<UserCredentials[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const loadUsers = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await authService.getAllUsers(token, 0, 20);
            setUsers(data);
        } catch (error) {
            console.error("Error cargando usuarios", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            loadUsers();
        }
    }, [token, loadUsers]);

    useEffect(() => {
        const unsubscribe = subscribeUsers(() => loadUsers());
        return unsubscribe;
    }, [subscribeUsers, loadUsers]);

    const value = useMemo(
        () => ({
            users,
            loading,
            reloadUsers: loadUsers,
        }),
        [
            users,
            loading,
            loadUsers,
        ]
    );

    return (
        <UsersContext.Provider value={value}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = () => useContext(UsersContext);
