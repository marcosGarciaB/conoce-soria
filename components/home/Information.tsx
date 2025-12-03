import {
    StyleSheet,
    Text,
    View
} from "react-native";

const Information = () => {
    return (
        <View style={styles.heroContainer}>
            <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Explora. Disfruta. Siente Soria.</Text>
                <Text style={styles.heroSubtitle}>
                    La magia de una tierra auténtica en la palma de tu mano.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    heroWrapper: {
        paddingHorizontal: 22,
        paddingTop: 10,
        marginBottom: 10,
    },
    heroContainer: {
        margin: 10,
        paddingHorizontal: 22,
        paddingVertical: 28,
        borderRadius: 24,
        marginTop: 20,
        backgroundColor: "transparent",
        backgroundImage: "linear-gradient(145deg, #fffffeff, #F5F5F5)",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 5,
    },
    heroContent: {
        gap: 6,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1a1a1a",
    },
    heroSubtitle: {
        fontSize: 15,
        color: "#555",
        opacity: 0.9,
        lineHeight: 26,
        fontWeight: "500",
    },
});

export default Information;