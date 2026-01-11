import { assetsQuery } from "@/api/assets";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import SearchBar from "@/components/search-bar";
import AssetCard from "./components/asset-card";

export default function AssetsScreen() {
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
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, SKU, or barcode..."
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No assets found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by name, SKU, or barcode..."
      />
      <FlashList
        data={filteredAssets}
        renderItem={({ item }) => <AssetCard asset={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
}));
