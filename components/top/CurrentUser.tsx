import { useUserData } from "@/contexts/UserDataContext";
import { useLoadTop } from "@/hooks/useLoadTop";
import UserChips from "../common/UserChips";

const CurrentUser = () => {
    const { user } = useUserData();
    const { userRank } = useLoadTop();

    if (!user) return null;

    return (
        <UserChips
            nombre={user.nombre}
            email={user.email}
            puntos={user.puntos}
            userRank={userRank}
            fotoPerfil={user.fotoPerfilUrl ?? ""}
        />
    );
};

export default CurrentUser;
