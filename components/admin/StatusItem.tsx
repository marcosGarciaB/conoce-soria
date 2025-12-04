import { StyleSheet, Text } from "react-native";

interface StatusItemProps {
    isActive?: boolean;
}

const StatusItem = ({ isActive }: StatusItemProps) => {

    return (
        <Text
            style={[
                styles.overlayStatus,
                isActive ? styles.active : styles.inactive,
            ]}
        >
            {isActive ? "Activo" : "Inactivo"}
        </Text>
    );
}

const styles = StyleSheet.create({
    overlayStatus: {
        position: "absolute",
        right: 5,
        top: 5,
        borderRadius: 50,
        fontWeight: "700",
        fontSize: 12,
        color: "white",
        padding: 10,
    },
    active: {
        backgroundColor: "#28a745",
    },
    inactive: {
        backgroundColor: "#d9534f",
    },
});

export default StatusItem;