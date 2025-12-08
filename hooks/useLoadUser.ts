import { useAuth } from "@/contexts/AuthContext";
import { adminService, NewUser } from "@/services/adminService";
import {
    authService,
    UpdateCredentials,
    UserCredentials,
} from "@/services/authService";
import { useEffect, useState } from "react";

/**
 * Hook para manejar la carga y edición de usuarios, incluyendo la gestión de la lista de usuarios.
 *
 * Este hook:
 * - Obtiene los datos del usuario autenticado usando `authService`.
 * - Permite cargar un usuario específico para edición mediante `adminService.getUserByEmail`.
 * - Permite crear un nuevo usuario o actualizar uno existente mediante `adminService`.
 * - Mantiene el estado de la lista de usuarios (`users`) y del usuario en edición (`editingUser`).
 *
 * Comportamiento:
 * - Solo funciona si el usuario está autenticado y tiene token válido.
 * - En caso de errores al cargar o actualizar usuarios, los registra en consola pero no interrumpe la aplicación.
 *
 * @param {UserCredentials} [userParam] - Usuario opcional para inicializar el hook.
 *
 * @returns {object} Contiene datos del usuario, usuarios en edición, lista de usuarios y funciones de carga/actualización.
 * @property {UserCredentials | null} user - Usuario autenticado.
 * @property {UserCredentials | null} editingUser - Usuario actualmente en edición.
 * @property {React.Dispatch<React.SetStateAction<UserCredentials | null>>} setEditingUser - Setter para actualizar el usuario en edición.
 * @property {UserCredentials[]} users - Lista de todos los usuarios.
 * @property {(email: string) => Promise<void>} loadEditingUser - Función para cargar un usuario específico para edición.
 * @property {(data: NewUser | UpdateCredentials) => Promise<void>} handleSubmitForm - Función para crear o actualizar un usuario.
 */
export const useLoadUser = (userParam?: UserCredentials) => {
	const { status, token } = useAuth();
	const isLogged = status === "authenticated";
	const [user, setUser] = useState<UserCredentials | null>(null);
	const [editingUser, setEditingUser] = useState<UserCredentials | null>(
		null
	);
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
	};

	const handleSubmitForm = async (data: NewUser | UpdateCredentials) => {
		if (!token) return;

		try {
			if (editingUser) {
				const updated = await adminService.updateUser(
					editingUser.email,
					data as UpdateCredentials,
					token!
				);
				setEditingUser(updated);

				setUsers((prev) =>
					prev.map((u) => (u.email === updated.email ? updated : u))
				);
			} else {
				const created = await adminService.createUser(
					data as NewUser,
					token!
				);
				setUsers((prev) => [...prev, created]);
			}
		} catch (error) {
			console.error("Error guardando usuario", error);
		}
	};

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
	};
};
