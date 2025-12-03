import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { passportService } from "@/services/passportService";
import { topService } from "@/services/topService";
import { useEffect, useState } from "react";

export const useLoadPassport = () => {
    const { status, token } = useAuth();
    const isLogged = status === "authenticated";
    const [loadingPassport, setLoadingPassport] = useState(true);

    // Para el mini pasaporte
    const [passportPreview, setPassportPreview] = useState<any[]>([]);
    const [passportPoints, setPassportPoints] = useState(0);
    // Para pasaporte completo
    const [ranking, setRanking] = useState<number | null>(null);
    const [registros, setRegistros] = useState<any[]>([]);

    useEffect(() => {
        if (!isLogged || !token) return;

        const loadData = async () => {
            try {
                const passportData = await passportService.getPasaporte(token);
                setPassportPreview(passportData.registros.slice(0, 4));

                setLoadingPassport(false);
            } catch (error) {
                console.log("Error cargando datos del pasaporte:", error);
            }
        };

        const loadPassport = async () => {
                    if (!token) return;
        
                    try {
                        const data = await passportService.getPasaporte(token);
                        const filtrado = data.registros.filter((r: any) => r.puntosOtorgados > 0);
        
                        setRegistros(filtrado);
                        setPassportPoints(Number(data.puntosTotales ?? 0));
        
                        const user = await authService.getUserData(token);
                        const top = await topService.getRankingData();
        
                        const pos = top.findIndex(
                            (u: any) => u.nombre === user.nombre || u.email === user.email
                        );
        
                        setRanking(pos >= 0 ? pos + 1 : null);
        
                    } catch (err) {
                        console.log("Error cargando pasaporte:", err);
                    } finally {
                        setLoadingPassport(false);
                    }
                };
        
                loadPassport();

        loadData();
    }, [isLogged, token]);

    return {
        passportPreview,
        passportPoints,
        loadingPassport,
        ranking,
        registros
    };
};
