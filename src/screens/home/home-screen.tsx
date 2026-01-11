import { NoCameraDeviceError } from "@/components/no-camera-device";
import { PermissionsPage } from "@/components/permissions-page";
import { ThemedText } from "@/components/themed-text";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

export default function HomeScreen() {
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;
  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/(app)/location">
        <ThemedText type="link">Fazer Check-in</ThemedText>
      </Link>
    </SafeAreaView>
  );
}
