import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Feather from "@expo/vector-icons/Feather";

type PickingMode = "individual" | "quantity";

type Props = {
  selectedMode?: PickingMode;
  onSelectMode: (mode: PickingMode) => void;
};

export default function PickingModeSelector(props: Props) {
  const { selectedMode, onSelectMode } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modo de Picking</Text>
      <View style={styles.modesContainer}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            selectedMode === "individual" && styles.modeButtonSelected,
          ]}
          onPress={() => onSelectMode("individual")}
        >
          <Feather
            name="scan"
            size={24}
            color={
              selectedMode === "individual"
                ? styles.selectedIcon.color
                : styles.icon.color
            }
          />
          <Text
            style={[
              styles.modeTitle,
              selectedMode === "individual" && styles.modeTitleSelected,
            ]}
          >
            Individual
          </Text>
          <Text style={styles.modeDescription}>
            Escaneie cada item individualmente
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            selectedMode === "quantity" && styles.modeButtonSelected,
          ]}
          onPress={() => onSelectMode("quantity")}
        >
          <Feather
            name="hash"
            size={24}
            color={
              selectedMode === "quantity"
                ? styles.selectedIcon.color
                : styles.icon.color
            }
          />
          <Text
            style={[
              styles.modeTitle,
              selectedMode === "quantity" && styles.modeTitleSelected,
            ]}
          >
            Quantidade
          </Text>
          <Text style={styles.modeDescription}>
            Escaneie e informe a quantidade
          </Text>
        </TouchableOpacity>
      </View>
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
  modesContainer: {
    gap: theme.spacing.md,
  },
  modeButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  modeButtonSelected: {
    borderColor: theme.colors.iconForeground,
    backgroundColor: theme.colors.searchBackground,
  },
  icon: {
    color: theme.colors.icon,
  },
  selectedIcon: {
    color: theme.colors.iconForeground,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  modeTitleSelected: {
    color: theme.colors.iconForeground,
  },
  modeDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
}));

