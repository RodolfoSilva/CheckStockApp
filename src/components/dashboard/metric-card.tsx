import Feather from "@expo/vector-icons/Feather";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type Props = {
  icon: keyof typeof Feather.glyphMap;
  value: number;
  label: string;
  iconColor: string;
  iconBackgroundColor: string;
};

export default function MetricCard(props: Props) {
  const { icon, value, label, iconColor, iconBackgroundColor } = props;

  return (
    <View style={styles.card}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}
      >
        <Feather name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    lineHeight: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
}));
