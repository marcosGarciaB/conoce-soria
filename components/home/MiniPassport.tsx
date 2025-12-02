import { useLoadPassport } from "@/hooks/useLoadPassport";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoadingScreen from "../common/Loading";

interface MiniPassportProps {
    navigation?: any;
}


const MiniPassport = ({ navigation }: MiniPassportProps) => {
    const { passportPoints, passportPreview, loadingPassport, ranking } = useLoadPassport();

    if (loadingPassport) {
        return (
            <LoadingScreen />
        );
    }
    return (
        <TouchableOpacity
            style={styles.passportCard}
            onPress={() => navigation.navigate("PassportScreen")}
            activeOpacity={0.9}
        >
            <Text style={styles.passportTitle}>
                Tu Pasaporte de Experiencias
            </Text>

            <View style={styles.passportHeaderRow}>
                <Text style={styles.passportPoints}>
                    {passportPoints} puntos
                </Text>
                {passportPoints !== null && (
                    <Text style={styles.passportRanking}>
                        #{ranking} en el ranking
                    </Text>
                )}
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.passportMiniRow}
            >
                {passportPreview.map((item, i) => {
                    return (
                        <View key={i} style={styles.miniItem}>
                            <Image
                                source={{ uri: item.imgPortada }}
                                style={styles.miniImage}
                            />
                            <Text style={styles.miniName} numberOfLines={4}>
                                {item.titulo}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>

            <Text style={styles.passportMore}>ver más…</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    passportCard: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 32,
        padding: 24,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 12,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    passportTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#FF6B00",
        marginBottom: 14,
        letterSpacing: 0.5,
    },
    passportHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },
    passportPoints: {
        fontSize: 18,
        fontWeight: "800",
        color: "#1C1C1C",
    },
    passportRanking: {
        fontSize: 14,
        fontWeight: "500",
        color: "#9E9E9E",
    },
    passportMiniRow: {
        flexDirection: "row",
        paddingVertical: 12,
    },
    miniItem: {
        alignItems: "center",
        marginRight: 16,
        width: "20%",
        backgroundColor: "linear-gradient(135deg, #FFF8F0, #FFE6CC)",
        borderRadius: 20,
        minWidth: 120,
        padding: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 0.5,
        borderColor: "#E0E0E0",
    },
    miniImage: {
        width: "100%",
        height: 70,
        borderRadius: 12,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: "#FFDAB3",
    },
    miniName: {
        color: "#000",
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 12,
        overflow: "hidden",
    },
    passportMore: {
        fontSize: 14,
        marginTop: 12,
        color: "#999",
        fontStyle: "italic",
        textAlign: "right",
        letterSpacing: 0.3,
    },
});

export default MiniPassport;