import { authService, UserCredentials } from "@/services/authService";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useRefresh } from "./RefreshContext";

interface UserDataContextProps {
    user: UserCredentials | null;
    loadingUser: boolean;
    loadUser: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<UserCredentials | null>>;
}

const UserDataContext = createContext<UserDataContextProps>({
    user: null,
    loadingUser: false,
    loadUser: async () => { },
    setUser: () => { },
});

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAuth();
    const [user, setUser] = useState<UserCredentials | null>(null);
    const [loadingUser, setLoadingUser] = useState(false);
    const { subscribeUsers, subscribeTop } = useRefresh();

    const loadUser = useCallback(async () => {
        if (!token) return;
        try {
            setLoadingUser(true);
            const data = await authService.getUserData(token);
            setUser(data);
        } catch (err) {
            console.log("Error cargando user:", err);
        } finally {
            setLoadingUser(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) loadUser();
        else setUser(null);
    }, [token, loadUser]);

    useEffect(() => {
        const unsub1 = subscribeUsers(() => loadUser());
        const unsub2 = subscribeTop(() => loadUser());
        return () => {
            unsub1();
            unsub2();
        };
    }, [subscribeUsers, subscribeTop, loadUser]);

    return (
        <UserDataContext.Provider value={{ user, loadingUser, loadUser, setUser }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = () => useContext(UserDataContext);
