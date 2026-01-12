import { assetsQuery } from "@/api/assets";
import Asset from "@/db/models/asset";
import Feather from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type Props = {
  selectedAssetId?: string;
  onSelectAsset: (asset: Asset) => void;
};

export default function AssetSelector(props: Props) {
  const { selectedAssetId, onSelectAsset } = props;
  const { data: assets = [], isLoading } = useQuery(assetsQuery);

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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione o Asset</Text>
      <FlashList
        data={assets}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.assetItem,
              selectedAssetId === item.id && styles.assetItemSelected,
            ]}
            onPress={() => onSelectAsset(item)}
          >
            <View style={styles.assetContent}>
              <Feather
                name="box"
                size={20}
                color={
                  selectedAssetId === item.id
                    ? styles.selectedIcon.color
                    : styles.icon.color
                }
              />
              <Text
                style={[
                  styles.assetName,
                  selectedAssetId === item.id && styles.assetNameSelected,
                ]}
              >
                {item.name}
              </Text>
              <Text style={styles.assetCode}>{item.code}</Text>
            </View>
            {selectedAssetId === item.id && (
              <Feather name="check" size={20} color={styles.checkIcon.color} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
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
  },
  assetItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  assetItemSelected: {
    borderColor: theme.colors.iconForeground,
    backgroundColor: theme.colors.searchBackground,
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
  selectedIcon: {
    color: theme.colors.iconForeground,
  },
  assetName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  assetNameSelected: {
    color: theme.colors.iconForeground,
  },
  assetCode: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  checkIcon: {
    color: theme.colors.iconForeground,
  },
}));
