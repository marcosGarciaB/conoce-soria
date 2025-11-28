import {
    StyleSheet, Text,
    TouchableOpacity
} from "react-native";

interface ButtonProps {
    title: string;
    onPress: () => void;
}

const Button = ({ title, onPress }: ButtonProps) => {

    return (
        <>
            {title === "Cerrar sesión" ?
                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        { backgroundColor: "#FF6B00" },
                    ]}
                    onPress={onPress}
                >
                    <Text
                        style={[styles.actionText, { color: "white" }]}
                    >
                        Cerrar sesión
                    </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onPress}
                >
                    <Text style={styles.actionText}>
                        {title}
                    </Text>
                </TouchableOpacity>
            }
        </>
    );
}

const styles = StyleSheet.create({
    actionButton: {
        backgroundColor: "#fff",
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    actionText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "bold",
    },
});

export default Button;

