import { getOrCreateConferenceItem } from "@/api/conference-items";
import { useCreatePicking } from "@/api/pickings";
import { NoCameraDeviceError } from "@/components/no-camera-device";
import { PermissionsPage } from "@/components/permissions-page";
import Asset from "@/db/models/asset";
import useBeep from "@/hooks/use-beep";
import { throttleCodeScanner } from "@/utils/throttle-code-scanner";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { StyleSheet as RNStyleSheet, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

type Props = {
  conferenceId: string;
  asset: Asset;
  cameraHeight?: number;
};

const individualScanner = throttleCodeScanner(3, 3000);

export default function IndividualPickingView(props: Props) {
  const { conferenceId, asset, cameraHeight } = props;
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();
  const createPickingMutation = useCreatePicking();
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const scannedItemsRef = useRef<string[]>([]);
  const beep = useBeep();

  // Update ref when scannedItems changes
  useEffect(() => {
    scannedItemsRef.current = scannedItems;
  }, [scannedItems]);

  useEffect(() => {
    return individualScanner.addListener(async (code) => {
      const codeValue = code.value;
      if (!codeValue) return;

      // Check if already scanned in this session using ref
      if (scannedItemsRef.current.includes(codeValue)) {
        return;
      }

      beep();

      try {
        // Get or create conference item
        const conferenceItem = await getOrCreateConferenceItem(
          codeValue,
          asset.id
        );

        // Create picking
        await createPickingMutation.mutateAsync({
          conference_id: conferenceId,
          asset_id: asset.id,
          conference_item_id: conferenceItem.id,
          quantity: 1,
          barcode: codeValue,
          picking_mode: "individual",
        });

        setScannedItems((prev) => {
          const updated = [...prev, codeValue];
          scannedItemsRef.current = updated;
          return updated;
        });
      } catch (error) {
        console.error("Error creating picking:", error);
      }
    });
  }, [conferenceId, asset.id, beep, createPickingMutation]);

  const codeScanner = useCodeScanner({
    codeTypes: ["code-128", "upc-a", "ean-13", "qr"],
    onCodeScanned: (codes) => codes.forEach(individualScanner.process),
  });

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;

  return (
    <View style={cameraHeight ? undefined : styles.container}>
      <View
        style={[
          cameraHeight ? { height: cameraHeight } : styles.cameraContainer,
        ]}
      >
        <Camera
          style={cameraHeight ? RNStyleSheet.absoluteFill : styles.camera}
          device={device}
          codeScanner={codeScanner}
          isActive={true}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Escaneie os itens individualmente</Text>
        <Text style={styles.countText}>
          Itens escaneados: {scannedItems.length}
        </Text>
      </View>
      {scannedItems.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Itens Escaneados</Text>
          <FlashList
            data={scannedItems}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>{item}</Text>
              </View>
            )}
            nestedScrollEnabled={true}
            scrollEnabled={false}
          />
        </View>
      )}
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
  infoContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  countText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  listContainer: {
    height: 200,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  listItem: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  listItemText: {
    fontSize: 14,
    color: theme.colors.text,
  },
}));
