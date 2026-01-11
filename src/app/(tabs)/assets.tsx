import { assetsQuery } from "@/api/assets";
import Asset from "@/db/models/asset";
import Feather from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

function AssetCard({ asset }: { asset: Asset }) {
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
    <View style={styles.assetCard}>
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
    </View>
  );
}

function SearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInput}>
        <Feather name="search" size={20} color={theme.colors.icon} />
        <TextInput
          style={styles.searchText}
          placeholder="Search by name, SKU, or barcode..."
          placeholderTextColor={theme.colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

export default function AssetsScreen() {
  const { theme } = useUnistyles();
  const { data: assets, isLoading } = useQuery(assetsQuery);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssets = useMemo(() => {
    if (!assets) return [];
    if (!searchQuery.trim()) return assets;

    const query = searchQuery.toLowerCase().trim();
    return assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(query) ||
        asset.code.toLowerCase().includes(query)
    );
  }, [assets, searchQuery]);

  if (isLoading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={[styles.assetName, { color: theme.colors.text }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={[styles.assetName, { color: theme.colors.text }]}>
            No assets found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <FlashList
        data={filteredAssets}
        renderItem={({ item }) => <AssetCard asset={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.searchBackground,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  searchIcon: {
    color: theme.colors.icon,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  searchPlaceholder: {
    color: theme.colors.textTertiary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  assetCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  assetIconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.iconBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  assetIcon: {
    color: theme.colors.iconForeground,
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
  assetStockIcon: {
    color: theme.colors.icon,
  },
  assetStockText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
}));
