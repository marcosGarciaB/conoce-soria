import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useDotsAnimation } from "../animations/loadingAnimation";

// En LoadingScreen.js
const LoadingScreen = () => {
    const { dot1, dot2, dot3 } = useDotsAnimation();

    return (
        <View style={styles.container}>
            <View style={styles.dotsContainer}>

                <Animated.Text style={[styles.dotStyle, { opacity: dot1 }]}>.</Animated.Text>
                <Animated.Text style={[styles.dotStyle, { opacity: dot2 }]}>.</Animated.Text>
                <Animated.Text style={[styles.dotStyle, { opacity: dot3 }]}>.</Animated.Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotStyle: {
        fontSize: 90, 
        fontWeight: "600",
        color: "#4A4A4A",
    },
});

export default LoadingScreen;