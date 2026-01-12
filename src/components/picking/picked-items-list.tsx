import { usePickingsByConference } from "@/api/pickings";
import ConferencePicking from "@/db/models/conference-picking";
import Feather from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type Props = {
  conferenceId: string;
};

export default function PickedItemsList(props: Props) {
  const { conferenceId } = props;
  const {
    data: pickings = [],
    isLoading,
    refetch,
  } = usePickingsByConference(conferenceId);

  console.log("PickedItemsList - pickings:", pickings.length, pickings);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (pickings.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nenhum picking realizado ainda</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pickings Realizados</Text>
      <FlashList
        data={pickings}
        renderItem={({ item }) => <PickingItem picking={item} />}
        nestedScrollEnabled={true}
        scrollEnabled={false}
      />
    </View>
  );
}

type PickingItemProps = {
  picking: ConferencePicking;
};

function PickingItem(props: PickingItemProps) {
  const { picking } = props;
  const modeIcon = picking.pickingMode === "individual" ? "code" : "hash";
  const modeLabel =
    picking.pickingMode === "individual" ? "Individual" : "Quantidade";

  return (
    <View style={styles.pickingItem}>
      <View style={styles.pickingIcon}>
        <Feather name={modeIcon} size={20} color={styles.icon.color} />
      </View>
      <View style={styles.pickingContent}>
        <Text style={styles.pickingBarcode}>{picking.barcode}</Text>
        <View style={styles.pickingDetails}>
          <Text style={styles.pickingMode}>{modeLabel}</Text>
          <Text style={styles.pickingQuantity}>Qtd: {picking.quantity}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.md,
    height: 300,
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
  pickingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  pickingIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.iconBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: theme.colors.iconForeground,
  },
  pickingContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  pickingBarcode: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  pickingDetails: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  pickingMode: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  pickingQuantity: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
}));
