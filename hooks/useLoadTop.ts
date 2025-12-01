import { UserCredentials } from "@/services/authService";
import { topService, UsuarioRankingDTO } from "@/services/topService";
import { useEffect, useState } from "react";


export const useLoadTop = () => {
    const [user, setUser] = useState<UserCredentials>();
    const [loading, setLoading] = useState(true);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [topUsuarios, setTopUsuarios] = useState<UsuarioRankingDTO[]>([]);

    useEffect(() => {
            const loadRanking = async () => {
                try {
                    const top = await topService.getRankingData();
                    setTopUsuarios(top);
    
                    if (user) {
                        const pos = top.findIndex(
                            (u) =>
                                u.nombre === user.nombre || u.email === user.email
                        );
                        setUserRank(pos >= 0 ? pos + 1 : null);
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            };
            loadRanking();
        }, [user]);

    return {
        user,
        topUsuarios,
        userRank,
    }
};