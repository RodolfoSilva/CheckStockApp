import Place from "@/db/models/place";
import Feather from "@expo/vector-icons/Feather";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type Props = {
  place: Place;
  onPress?: () => void;
};

export default function PlaceCard(props: Props) {
  const { place, onPress } = props;

  // Generate a simple barcode-like number from the place code or ID
  const barcodeNumber = useMemo(() => {
    // Use the code if available, otherwise generate from ID
    const code = place.code || place.id;
    // Convert to a 4-digit number-like string
    const hash = code
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return String(hash % 10000).padStart(4, "0");
  }, [place.code, place.id]);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Feather name="package" size={24} style={styles.icon} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{place.name}</Text>
        <View style={styles.cardDetails}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{place.code}</Text>
          </View>
          <View style={styles.dot} />
          <View style={styles.barcodeContainer}>
            {[...Array(3)].map((_, i) => (
              <View key={i} style={styles.barcodeLine} />
            ))}
            <Text style={styles.barcodeNumber}>{barcodeNumber}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  cardPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#FFFFFF",
  },
  cardContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    lineHeight: 24,
  },
  cardDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  pill: {
    backgroundColor: theme.colors.tagBackground,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  pillText: {
    fontSize: 12,
    color: theme.colors.tagText,
    fontWeight: "500",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.textTertiary,
  },
  barcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  barcodeLine: {
    width: 2,
    height: 12,
    backgroundColor: theme.colors.textTertiary,
    borderRadius: 1,
  },
  barcodeNumber: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginLeft: theme.spacing.xs,
  },
}));
