import React from "react";
import {
    Animated,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useModalAnimation } from "../animations/modalAnimation";


interface PrivacyModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isVisible, onClose }) => {
    const { scale, opacity } = useModalAnimation(isVisible);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            transform: [{ scale }],
                            opacity: opacity,
                        },
                    ]}
                    >
                    <Text style={styles.modalTitle}>Política de Privacidad</Text>
                    <ScrollView style={styles.scrollContainer}>
                        <Text style={styles.modalText}>
                            Bienvenido a nuestra aplicación. La privacidad y seguridad de tus datos personales es muy importante para nosotros. Por ello, nos comprometemos a proteger tu información de manera responsable y transparente.

                            {"\n\n"}<Text style={styles.boldText}>1. Información que recopilamos</Text>
                            {"\n"}Recopilamos información personal como tu nombre, correo electrónico, número de teléfono y preferencias de uso con el fin de ofrecerte una experiencia personalizada. También podemos recopilar datos de uso de la aplicación y estadísticas de interacción.

                            {"\n\n"}<Text style={styles.boldText}>2. Uso de la información</Text>
                            {"\n"}Los datos recopilados se utilizan únicamente para:
                            {"\n"}- Mejorar la funcionalidad de la aplicación y la experiencia del usuario.
                            {"\n"}- Personalizar contenidos y recomendaciones.
                            {"\n"}- Contactarte para actualizaciones importantes o soporte técnico.

                            {"\n\n"}<Text style={styles.boldText}>3. Compartir información con terceros</Text>
                            {"\n"}No compartimos, vendemos ni alquilamos tus datos personales a terceros sin tu consentimiento, salvo cuando sea necesario para cumplir con obligaciones legales o proteger nuestros derechos.

                            {"\n\n"}<Text style={styles.boldText}>4. Seguridad de los datos</Text>
                            {"\n"}Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra pérdida, acceso no autorizado, alteración o divulgación.

                            {"\n\n"}<Text style={styles.boldText}>5. Tus derechos</Text>
                            {"\n"}Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier momento. Para ejercer estos derechos, puedes contactarnos directamente desde la aplicación o mediante los datos de contacto que proporcionamos.

                            {"\n\n"}<Text style={styles.boldText}>6. Cambios en la política de privacidad</Text>
                            {"\n"}Podemos actualizar nuestra política de privacidad ocasionalmente. Los cambios se notificarán dentro de la aplicación y, si son significativos, solicitaremos tu consentimiento nuevamente.

                            {"\n\n"}Al usar nuestra aplicación, aceptas los términos de esta política de privacidad y nos das tu consentimiento para el uso responsable de tus datos.
                        </Text>
                    </ScrollView>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
            </Animated.View>
        </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        height: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    scrollContainer: {
        width: '100%',
        marginVertical: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 20,
        padding: 20
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#FF6B00',
    },
    modalText: {
        fontSize: 16,
        color: '#333',
    },
    boldText: {
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 15,
        backgroundColor: '#FF6B00',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default PrivacyModal;
