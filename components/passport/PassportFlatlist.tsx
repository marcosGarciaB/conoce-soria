import { useLoadPassport } from "@/hooks/useLoadPassport";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View
} from "react-native";
import LoadingScreen from "../common/Loading";


const PassportFlatlist = () => {
    const { registros, loadingPassport } = useLoadPassport();

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: item.imagen ?? "https://picsum.photos/200" }}
                style={styles.cardImage}
            />

            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <Text style={styles.cardDate}>
                    {new Date(item.fechaRegistro).toLocaleDateString("es-ES")}
                </Text>
            </View>

            <View style={styles.pointsBadgeItem}>
                <Text style={styles.pointsAmount}>+{item.puntosOtorgados}</Text>
            </View>
        </View>
    );

    return (
        <>
            <FlatList
                data={registros}
                keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.5}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListFooterComponent={loadingPassport ? <LoadingScreen /> : null}
            />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 20,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardImage: {
        width: 70,
        height: 70,
        borderRadius: 16,
        marginRight: 16,
        backgroundColor: "#eee",
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    cardDate: {
        fontSize: 13,
        color: "#999",
    },
    pointsBadgeItem: {
        backgroundColor: "#FFF4E0",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 12,
        marginLeft: "auto",
        shadowColor: "#FF6B00",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2
    },
    pointsAmount: {
        fontSize: 14,
        fontWeight: "700",
        color: "#FF6B00",
    },

});

export default PassportFlatlist;
