import { Text, View } from "react-native";

import { NoCameraDeviceError } from "@/components/no-camera-device";
import { PermissionsPage } from "@/components/permissions-page";
import useBeep from "@/hooks/use-beep";
import { throttleCodeScanner } from "@/utils/throttle-code-scanner";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

const locationScanner = throttleCodeScanner(3, 3000);

export default function LocationScreen() {
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();
  const router = useRouter();

  const beep = useBeep();
  useEffect(() => {
    return locationScanner.addListener(async (code) => {
      const value = code.value;
      beep();
      router.replace(`/(app)/item?location=${value}`);
    });
  }, [beep, router]);

  const codeScanner = useCodeScanner({
    codeTypes: ["code-128", "upc-a", "ean-13", "qr"],
    onCodeScanned: (codes) => codes.forEach(locationScanner.process),
  });

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "white" }}>
      <View>
        <Text>Hello</Text>
      </View>

      <Camera
        style={{ flex: 1 }}
        device={device}
        codeScanner={codeScanner}
        isActive={true}
      />
    </SafeAreaView>
  );
}
