import { useAuth } from "@/contexts/AuthContext";
import { passportService } from "@/services/passportService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Camera, CameraView } from "expo-camera";

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message"; // <-- IMPORTANTE


const QrScannerScreen = () => {
  const { token } = useAuth();
  const navigation = useNavigation<any>();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      let freshToken = token;

      if (!freshToken) {
        freshToken = await AsyncStorage.getItem("authToken");
      }

      if (!freshToken) throw new Error("Token no disponible");

      console.log("📤 Enviando QR:", data);

      await passportService.registerFromQr(freshToken, data);

      // --- 1) Mostrar toast ---
      Toast.show({
        type: "success",
        text1: "¡+10 puntos! 🎉",
        text2: "Experiencia registrada",
        position: "top",
      });

      // --- 2) Navegar al pasaporte tras animación ---
      setTimeout(() => {
        navigation.navigate("PassportScreen");
      }, 1200);

    } catch (err: any) {
      console.error("❌ Error registrando desde QR:", err);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: err?.message ?? "No se ha podido registrar.",
        position: "top",
      });

      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No se ha concedido acceso a la cámara.</Text>
        <TouchableOpacity onPress={() => Camera.requestCameraPermissionsAsync()}>
          <Text style={{ color: "#FF6B00", marginTop: 12 }}>Pedir permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Escanear QR</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* SCANNER */}
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
        <View style={styles.scanMarker} />
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={{ color: "#555" }}>
          Apunta la cámara al código QR para registrar la experiencia.
        </Text>
        {scanned && (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => setScanned(false)}
          >
            <Text style={{ color: "white" }}>Volver a intentar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default QrScannerScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    height: 66,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#FF6B00" },
  scannerContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  scanMarker: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  retryBtn: {
    marginTop: 12,
    backgroundColor: "#FF6B00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});
