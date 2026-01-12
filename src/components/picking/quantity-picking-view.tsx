import { useCreatePicking } from "@/api/pickings";
import { NoCameraDeviceError } from "@/components/no-camera-device";
import { PermissionsPage } from "@/components/permissions-page";
import Asset from "@/db/models/asset";
import Button from "@/components/button";
import useBeep from "@/hooks/use-beep";
import { throttleCodeScanner } from "@/utils/throttle-code-scanner";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  conferenceId: string;
  asset: Asset;
};

const quantityScanner = throttleCodeScanner(3, 3000);

export default function QuantityPickingView(props: Props) {
  const { conferenceId, asset } = props;
  const { theme } = useUnistyles();
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();
  const createPickingMutation = useCreatePicking();
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showManualInput, setShowManualInput] = useState(false);
  const beep = useBeep();

  useEffect(() => {
    return quantityScanner.addListener(async (code) => {
      const codeValue = code.value;
      if (!codeValue) return;

      beep();
      setBarcode(codeValue);

      // Auto-increment mode: just increment quantity
      setQuantity((prev) => prev + 1);
      setShowManualInput(false);
    });
  }, [beep]);

  const codeScanner = useCodeScanner({
    codeTypes: ["code-128", "upc-a", "ean-13", "qr"],
    onCodeScanned: (codes) => codes.forEach(quantityScanner.process),
  });

  const handleConfirm = async () => {
    if (!barcode || quantity <= 0) return;

    try {
      await createPickingMutation.mutateAsync({
        conference_id: conferenceId,
        asset_id: asset.id,
        quantity: quantity,
        barcode: barcode,
        picking_mode: "quantity",
      });

      // Reset for next picking
      setBarcode("");
      setQuantity(1);
      setShowManualInput(false);
    } catch (error) {
      console.error("Error creating picking:", error);
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          device={device}
          codeScanner={codeScanner}
          isActive={true}
        />
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.barcodeContainer}>
          <Text style={styles.label}>Código de Barras</Text>
          <TextInput
            style={styles.barcodeInput}
            placeholder="Escaneie ou digite o código"
            placeholderTextColor={theme.colors.textTertiary}
            value={barcode}
            onChangeText={setBarcode}
          />
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.label}>Quantidade</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecrement}
            >
              <Feather name="minus" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              value={quantity.toString()}
              onChangeText={(text) => {
                const num = parseInt(text, 10);
                if (!isNaN(num) && num > 0) {
                  setQuantity(num);
                }
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncrement}
            >
              <Feather name="plus" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Confirmar Picking"
          onPress={handleConfirm}
          disabled={!barcode || quantity <= 0 || createPickingMutation.isPending}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  cameraContainer: {
    flex: 1,
    minHeight: 300,
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  barcodeContainer: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  barcodeInput: {
    backgroundColor: theme.colors.searchBackground,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quantityContainer: {
    gap: theme.spacing.sm,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.searchBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quantityInput: {
    flex: 1,
    backgroundColor: theme.colors.searchBackground,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
}));

