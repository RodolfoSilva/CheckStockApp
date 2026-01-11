import Asset from "@/db/models/asset";
import Feather from "@expo/vector-icons/Feather";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type Props = {
  asset: Asset;
  onPress?: () => void;
};

export default function AssetCard(props: Props) {
  const { asset, onPress } = props;
  const { theme } = useUnistyles();

  // Generate a mock stock number based on asset ID for display
  // In a real app, this would come from the database
  const stockNumber = useMemo(() => {
    const hash = asset.id.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return String((Math.abs(hash) % 9000) + 1000).padStart(4, "0");
  }, [asset.id]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.assetCard,
        pressed && styles.assetCardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.assetIconContainer}>
        <Feather name="box" size={24} color={theme.colors.iconForeground} />
      </View>
      <View style={styles.assetContent}>
        <Text style={styles.assetName}>{asset.name}</Text>
        <View style={styles.assetDetails}>
          <View style={styles.assetTag}>
            <Text style={styles.assetTagText}>{asset.code}</Text>
          </View>
          <View style={styles.assetSeparator} />
          <View style={styles.assetStock}>
            <Feather name="bar-chart-2" size={12} color={theme.colors.icon} />
            <Text style={styles.assetStockText}>{stockNumber}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  assetCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  assetCardPressed: {
    opacity: 0.7,
  },
  assetIconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.iconBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  assetContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  assetName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  assetDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  assetTag: {
    backgroundColor: theme.colors.tagBackground,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  assetTagText: {
    fontSize: 12,
    color: theme.colors.tagText,
    fontWeight: "500",
  },
  assetSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.textTertiary,
  },
  assetStock: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  assetStockText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
}));
