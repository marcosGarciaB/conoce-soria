import { useAuth } from "@/contexts/AuthContext";
import { passportService } from "@/services/passportService";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Camera, CameraView } from "expo-camera";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import RatingStars from "../components/common/RatingStars";

const QrScannerScreen = () => {
  const { token } = useAuth();
  const navigation = useNavigation<any>();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  // ⭐ Modal de valoración
  const [ratingModal, setRatingModal] = useState(false);
  const [currentUid, setCurrentUid] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    console.log("📤 QR detectado:", data);
    setCurrentUid(data);

    // Abrimos el popup de estrellas
    setRatingModal(true);
  };

  const enviarValoracion = async (estrellas: number) => {
    try {
      let freshToken = token ?? (await AsyncStorage.getItem("authToken"));
      if (!freshToken) throw new Error("Token no disponible");

      await passportService.registerFromQr(
        freshToken,
        currentUid,
        "" 
      );

      Toast.show({
        type: "success",
        text1: `¡+10 puntos! ⭐`,
        text2: `Valoración: ${estrellas} estrellas`,
        position: "top",
      });

      setRatingModal(false);

      setTimeout(() => navigation.replace("PassportScreen"), 600);

    } catch (err: any) {
      console.error("❌ Error registrando desde QR:", err);

      let msg = err?.message ?? "No se pudo registrar.";

      // Mensaje bonito si ya estaba registrada
      if (
        err?.response?.status === 409 ||
        msg.includes("ya existe") ||
        msg.includes("duplic")
      ) {
        msg = "Esa experiencia ya la tienes registrada 👀";
      }

      Toast.show({
        type: "error",
        text1: "Aviso",
        text2: msg,
        position: "top",
      });

      setRatingModal(false);
      setScanned(false); // Esto permite volver a escanear
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

      {/* CÁMARA */}
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />

        <View style={styles.scanMarker} />
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={{ color: "#555" }}>
          Apunta la cámara al QR para registrar la experiencia.
        </Text>
      </View>

      {/* ⭐ MODAL DE ESTRELLAS ⭐ */}
      <Modal visible={ratingModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Valora tu experiencia</Text>
            <Text style={styles.modalSubtitle}>Elige entre 1 y 5 estrellas</Text>

            <RatingStars size={42} onChange={(n) => enviarValoracion(n)} />
          </View>
        </View>
      </Modal>
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

  footer: { padding: 20, alignItems: "center" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: "#444", marginBottom: 20 },
});
