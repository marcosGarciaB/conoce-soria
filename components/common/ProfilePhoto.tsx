import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface ProfileAvatarProps {
    foto?: string | null;
    size?: number;
}

const DEFAULT_AVATAR =
    "https://thumbs.dreamstime.com/b/vector-de-perfil-avatar-predeterminado-foto-usuario-medios-sociales-icono-183042379.jpg";


const ProfileAvatar = ({ foto, size = 60 }: ProfileAvatarProps) => {
    return (
        <View
            style={[
                styles.container,
                styles.shadow,
                { width: size, height: size, borderRadius: size / 2 },
            ]}
        >
            <Image
                source={{uri: foto ? foto : DEFAULT_AVATAR}}
                style={{ width: "100%", height: "100%", borderRadius: size / 2 }}
                resizeMode="cover"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        backgroundColor: "#f1f1f1",
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
});

export default ProfileAvatar;
