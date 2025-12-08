import { authService } from "@/services/authService";
import { useEffect, useState } from "react";

/**
 * Hook para verificar si un usuario autenticado tiene rol de administrador.
 *
 * Este hook:
 * - Recibe opcionalmente un token JWT.
 * - Llama al servicio `authService.getUserData` para obtener los datos del usuario.
 * - Determina si el rol del usuario es "ADMIN" (independientemente de mayúsculas/minúsculas).
 * - Devuelve un booleano indicando si el usuario es administrador.
 *
 * Comportamiento:
 * - Si no se proporciona token, no realiza ninguna verificación y devuelve `false`.
 * - Si ocurre un error al consultar los datos del usuario, el error se registra en consola pero no interrumpe el funcionamiento.
 *
 * @param {string | null} [token] - Token JWT del usuario autenticado.
 * @returns {boolean} `true` si el usuario tiene rol ADMIN, `false` en caso contrario.
 */
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
