import { useAuth } from "@/contexts/AuthContext";
import { authService, UserCredentials } from "@/services/authService";
import { useEffect, useState } from "react";

export const useLoadUser = () => {
    const { status, token } = useAuth();
    const isLogged = status === "authenticated";
    const [user, setUser] = useState<UserCredentials>();

    useEffect(() => {
        const loadUser = async () => {
            if (!token) return;
            try {
                const userData = await authService.getUserData(token);
                setUser(userData);
            } catch (error) {
                console.log(error);
            }
        };
        loadUser();
    }, [isLogged]);

    return {
        user,
    }
}