import { authService } from "@/services/authService";
import { useEffect, useState } from "react";

export const useAdmin = (token?: string | null) => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!token) return;

            try {
                const user = await authService.getUserData(token);
                setIsAdmin(user.role === "ADMIN" || user.role === "admin");
            } catch (error) {
                console.error("Error comprobando rol ADMIN:", error);
            }
        };

        checkAdmin();
    }, [token]);

    return isAdmin;
};
