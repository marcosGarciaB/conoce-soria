import { useLoadPassport } from "@/hooks/useLoadPassport";
import {
    StyleSheet,
    Text,
    View
} from "react-native";

const HeaderCard = () => {
    const { passportPoints, ranking } = useLoadPassport();

    return (
        <View style={styles.headerCard}>
            <View style={styles.row}>
                <Text style={styles.pointsValue}>
                    Tienes {passportPoints} puntos
                </Text>

                {ranking !== null && (
                    <View style={styles.rankBadge}>
                        <Text style={styles.rankNumber}>#{ranking}</Text>
                        <Text style={styles.rankLabel}>Ranking</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerCard: {
        backgroundColor: "white",
        borderRadius: 22,
        paddingVertical: 22,
        paddingHorizontal: 26,
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    pointsValue: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1C1C1C",
        letterSpacing: 0.5,
    },
    rankBadge: {
        backgroundColor: "#FF6B00",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 14,
        alignItems: "center",
        shadowColor: "#FF6B00",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    rankNumber: {
        color: "white",
        fontSize: 16,
        fontWeight: "900",
    },
    rankLabel: {
        color: "white",
        fontSize: 10,
        opacity: 0.85,
        fontWeight: "600",
        marginTop: -2,
    }
});

export default HeaderCard;
