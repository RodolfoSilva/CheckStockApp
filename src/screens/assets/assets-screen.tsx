import { assetsQuery } from "@/api/assets";
import PressButton from "@/components/press-button";
import SearchBar from "@/components/search-bar";
import Asset from "@/db/models/asset";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import AssetCard from "./components/asset-card";
import NewAssetForm from "./components/new-asset-form";

export default function AssetsScreen() {
  const { data: assets = [], isLoading } = useQuery(assetsQuery);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>(
    undefined
  );

  const query = searchQuery.toLowerCase().trim();
  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(query) ||
      asset.code.toLowerCase().includes(query)
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <PressButton
              style={styles.actionButton}
              onPress={async () => {
                setEditingAsset(undefined);
                await TrueSheet.present("new-asset-sheet");
              }}
            >
              <Text style={styles.actionText}>Novo</Text>
            </PressButton>
          ),
        }}
      />

      <TrueSheet name="new-asset-sheet" detents={["auto"]} dismissible>
        <NewAssetForm
          asset={editingAsset}
          onSuccess={async () => {
            setEditingAsset(undefined);
            await TrueSheet.dismiss("new-asset-sheet");
          }}
        />
      </TrueSheet>

      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, SKU, or barcode..."
        />

        {filteredAssets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? "No assets found" : "No assets available"}
            </Text>
          </View>
        ) : (
          <FlashList
            data={filteredAssets}
            renderItem={({ item }) => (
              <AssetCard
                asset={item}
                onPress={async () => {
                  setEditingAsset(item);
                  await TrueSheet.present("new-asset-sheet");
                }}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  actionButton: {
    marginRight: theme.spacing.sm,
  },
  actionText: {
    fontSize: 16,
    color: theme.colors.iconForeground,
    fontWeight: "600",
  },
}));
