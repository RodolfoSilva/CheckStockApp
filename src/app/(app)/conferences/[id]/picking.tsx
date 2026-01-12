import { conferenceQuery } from "@/api/conferences";
import { usePickingsByConference } from "@/api/pickings";
import PickingFormSheet from "@/components/picking/picking-form-sheet";
import PressButton from "@/components/press-button";
import ConferencePicking from "@/db/models/conference-picking";
import Feather from "@expo/vector-icons/Feather";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function PickingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: conference, isLoading: isLoadingConference } = useQuery(
    conferenceQuery(id || "")
  );
  const { data: pickings = [] } = usePickingsByConference(id || "");

  const handleStartPicking = async () => {
    await TrueSheet.present("picking-form-sheet");
  };

  if (isLoadingConference || !conference) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
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
              onPress={handleStartPicking}
            >
              <Text style={styles.actionText}>Iniciar Picking</Text>
            </PressButton>
          ),
        }}
      />

      <TrueSheet name="picking-form-sheet" detents={["auto"]} dismissible>
        <PickingFormSheet
          conferenceId={id || ""}
          onClose={async () => {
            await TrueSheet.dismiss("picking-form-sheet");
          }}
        />
      </TrueSheet>

      <FlashList
        data={pickings}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.conferenceTitle}>{conference.name}</Text>
            <View style={styles.pickingsHeader}>
              <Text style={styles.pickingsTitle}>Pickings Realizados</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum picking realizado ainda</Text>
          </View>
        }
        renderItem={({ item }) => <PickingItem picking={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </>
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

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: theme.spacing.lg + rt.insets.bottom,
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
    marginBottom: theme.spacing.sm,
  },
  pickingsHeader: {
    paddingTop: theme.spacing.md,
  },
  pickingsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    padding: theme.spacing.xl,
  },
  actionButton: {
    marginRight: theme.spacing.sm,
  },
  actionText: {
    fontSize: 16,
    color: theme.colors.iconForeground,
    fontWeight: "600",
  },
  pickingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
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
  emptyContainer: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
}));
