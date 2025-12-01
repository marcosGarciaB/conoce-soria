import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ModalExampleProps {
    isPrize: boolean;
}

const ModalExample = ({isPrize}: ModalExampleProps) => {
    const [showRules, setShowRules] = useState(false);
    const [showPrize, setShowPrize] = useState(false);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TouchableOpacity onPress={() => setShowRules(true)} style={styles.button}>
                <Text style={styles.buttonText}>Normas del Juego</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowPrize(true)} style={styles.button}>
                <Text style={styles.buttonText}>Premio del Mes</Text>
            </TouchableOpacity>

            {/* Modal Normas */}
            <Modal visible={showRules} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Normas del Juego</Text>
                            <Text style={styles.modalContent}>
                                1. Participación y elegibilidad:

                                Todos los usuarios registrados en la aplicación son elegibles para participar en el ranking semanal.

                                La participación se contabiliza a través de la interacción dentro de la app, completando actividades, retos o puntos asignados según la dinámica de cada semana.

                                2. Criterios de puntuación:

                                Los puntos se acumulan en función de la participación activa en las actividades, visitas a lugares destacados, quizzes o retos semanales.

                                La puntuación de cada usuario será visible en el ranking en tiempo real.

                                3. Selección de ganadores:

                                Cada semana, el usuario con mayor puntaje acumulado será declarado ganador de esa semana.

                                En caso de empate, se considerará el tiempo de finalización de los retos o la participación más temprana en la semana correspondiente.

                                4. Comportamiento y ética:

                                Se espera un comportamiento respetuoso y ético en todas las interacciones dentro de la plataforma.

                                Cualquier intento de manipular el sistema, vulnerar las reglas o perjudicar a otros usuarios podrá resultar en descalificación.

                                5. Condiciones adicionales:

                                La organización se reserva el derecho de modificar las normas y criterios de puntuación si se considera necesario, garantizando siempre la transparencia y comunicación con los participantes.

                                La participación en el ranking implica la aceptación de estas normas y condiciones.
                            </Text>
                        </ScrollView>
                        <TouchableOpacity onPress={() => setShowRules(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={showPrize} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Premio Mensual</Text>
                            <Text style={styles.modalContent}>
                                Cada mes, los ganadores semanales tienen la oportunidad de disfrutar de un premio exclusivo diseñado para reconocer su dedicación y participación.

                                1. Estructura del premio:

                                Cada semana se selecciona un ganador del ranking, sumando un total de cuatro ganadores al mes.

                                Cada ganador podrá asistir al premio acompañado de una persona de su elección, duplicando la experiencia.

                                2. Experiencia del premio:

                                El premio consiste en una excursión guiada exclusiva a un lugar emblemático de Soria, como el yacimiento de Tiermes o sitios históricos de interés cultural.

                                Durante la excursión, los participantes disfrutarán de explicaciones detalladas proporcionadas por un guía profesional, garantizando una experiencia enriquecedora y memorable.

                                3. Logística y fechas:

                                La excursión se programará una vez al mes, asegurando la participación de los cuatro ganadores y sus acompañantes.

                                Los detalles específicos de fecha, hora y puntos de encuentro serán comunicados directamente a los ganadores con antelación suficiente para organizar su asistencia.

                                4. Condiciones del premio:

                                La participación en el premio implica aceptación de las normas de la excursión y del comportamiento respetuoso hacia el grupo y el guía.

                                La organización se reserva el derecho de ajustar la logística por motivos de seguridad, climáticos o de fuerza mayor, garantizando siempre la máxima transparencia con los premiados.

                                Disfruta de esta oportunidad única de conocer Soria de una manera exclusiva, educativa y divertida, gracias a tu participación activa en el ranking.
                            </Text>
                        </ScrollView>
                        <TouchableOpacity onPress={() => setShowPrize(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#4B7BE5",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 20,

    },
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 15,
        color: "#222",
    },
    modalContent: {
        fontSize: 16,
        color: "#555",
        lineHeight: 24,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#4B7BE5",
        padding: 12,
        borderRadius: 12,
    },
    closeButtonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "600",
    },
});

export default ModalExample;
