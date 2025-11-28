import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ItemButtonProps {
    title: string;
    onPress: () => void;
}

const ItemButton = ({ title, onPress }: ItemButtonProps) => {

    return (
        <View>
            {title === 'Editar' ?
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={onPress}
                >
                    <Ionicons
                        name={"pencil-sharp"}
                        size={20}
                        color={"white"}
                    />
                    <Text style={styles.buttonText}>{title}</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={onPress}
                >
                    <Ionicons
                        name={"trash-bin-sharp"}
                        size={20}
                        color={"white"}
                    />
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    editButton: {
        backgroundColor: "#0486ffff",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 10,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#F44336",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
        paddingLeft: 10,
    },
});

export default ItemButton;
