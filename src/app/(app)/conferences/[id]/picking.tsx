import { conferenceQuery } from "@/api/conferences";
import Button from "@/components/button";
import AssetSelector from "@/components/picking/asset-selector";
import IndividualPickingView from "@/components/picking/individual-picking-view";
import PickedItemsList from "@/components/picking/picked-items-list";
import PickingModeSelector from "@/components/picking/picking-mode-selector";
import QuantityPickingView from "@/components/picking/quantity-picking-view";
import Asset from "@/db/models/asset";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type PickingMode = "individual" | "quantity";

export default function PickingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: conference, isLoading } = useQuery(conferenceQuery(id || ""));
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [pickingMode, setPickingMode] = useState<PickingMode | undefined>(
    undefined
  );

  if (isLoading || !conference) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const handleReset = () => {
    setSelectedAsset(null);
    setPickingMode(undefined);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.conferenceTitle}>{conference.name}</Text>
      </View>

      {!selectedAsset ? (
        <AssetSelector
          selectedAssetId={selectedAsset?.id}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
        />
      ) : !pickingMode ? (
        <>
          <View style={styles.selectedAssetContainer}>
            <Text style={styles.selectedAssetText}>
              Asset selecionado: {selectedAsset.name}
            </Text>
            <Button
              title="Trocar Asset"
              onPress={handleReset}
              variant="secondary"
            />
          </View>
          <PickingModeSelector
            selectedMode={pickingMode}
            onSelectMode={(mode) => setPickingMode(mode)}
          />
        </>
      ) : (
        <>
          <View style={styles.selectedAssetContainer}>
            <Text style={styles.selectedAssetText}>
              Asset: {selectedAsset.name} | Modo:{" "}
              {pickingMode === "individual" ? "Individual" : "Quantidade"}
            </Text>
            <Button title="Voltar" onPress={handleReset} variant="secondary" />
          </View>
          {pickingMode === "individual" ? (
            <IndividualPickingView
              conferenceId={id || ""}
              asset={selectedAsset}
            />
          ) : (
            <QuantityPickingView
              conferenceId={id || ""}
              asset={selectedAsset}
            />
          )}
        </>
      )}

      <PickedItemsList conferenceId={id || ""} />
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.lg,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  conferenceTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    padding: theme.spacing.xl,
  },
  selectedAssetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedAssetText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
}));
