import { assetsQuery } from "@/api/assets";
import Asset from "@/db/models/asset";
import Button from "@/components/button";
import IndividualPickingView from "@/components/picking/individual-picking-view";
import PickingModeSelector from "@/components/picking/picking-mode-selector";
import QuantityPickingView from "@/components/picking/quantity-picking-view";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Feather from "@expo/vector-icons/Feather";
import { useWindowDimensions } from "react-native";

type PickingMode = "individual" | "quantity";

type Props = {
  conferenceId: string;
  onClose: () => void;
};

export default function PickingFormSheet(props: Props) {
  const { conferenceId, onClose } = props;
  const { data: assets = [], isLoading } = useQuery(assetsQuery);
  const { height: windowHeight } = useWindowDimensions();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [pickingMode, setPickingMode] = useState<PickingMode | undefined>(
    undefined
  );

  // Calculate camera height - use 60% of screen height for camera
  const cameraHeight = windowHeight * 0.6;

  const handleReset = () => {
    setSelectedAsset(null);
    setPickingMode(undefined);
  };

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando assets...</Text>
      </View>
    );
  }

  if (assets.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nenhum asset disponível</Text>
        <Button title="Fechar" onPress={onClose} variant="secondary" />
      </View>
    );
  }

  // Show picking view when both asset and mode are selected
  if (selectedAsset && pickingMode) {
    return (
      <View style={styles.pickingViewContainer}>
        <View style={styles.selectedAssetContainer}>
          <Text style={styles.selectedAssetText}>
            Asset: {selectedAsset.name} | Modo:{" "}
            {pickingMode === "individual" ? "Individual" : "Quantidade"}
          </Text>
          <Button title="Voltar" onPress={handleReset} variant="secondary" />
        </View>
        {pickingMode === "individual" ? (
          <IndividualPickingView
            conferenceId={conferenceId}
            asset={selectedAsset}
            cameraHeight={cameraHeight}
          />
        ) : (
          <QuantityPickingView
            conferenceId={conferenceId}
            asset={selectedAsset}
            cameraHeight={cameraHeight}
          />
        )}
      </View>
    );
  }

  // Show mode selector when asset is selected
  if (selectedAsset && !pickingMode) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
      </ScrollView>
    );
  }

  // Show asset selector
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Selecione o Asset</Text>
      <View style={styles.assetsList}>
        {assets.map((asset) => (
          <TouchableOpacity
            key={asset.id}
            style={styles.assetItem}
            onPress={() => handleSelectAsset(asset)}
          >
            <View style={styles.assetContent}>
              <Feather name="box" size={20} color={styles.icon.color} />
              <Text style={styles.assetName}>{asset.name}</Text>
              <Text style={styles.assetCode}>{asset.code}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.md,
  },
  content: {
    paddingBottom: theme.spacing.lg,
  },
  pickingViewContainer: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    padding: theme.spacing.lg,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  assetsList: {
    gap: theme.spacing.sm,
  },
  assetItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  assetContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  icon: {
    color: theme.colors.icon,
  },
  assetName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  assetCode: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  selectedAssetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  selectedAssetText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
}));
