import Conference from "@/db/models/conference";
import Feather from "@expo/vector-icons/Feather";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type Props = {
  conference: Conference;
  itemsScanned: number;
};

export default function CurrentActivityCard(props: Props) {
  const { conference, itemsScanned } = props;

  return (
    <View style={styles.card}>
      <View style={styles.playIconContainer}>
        <Feather name="play" size={64} color="rgba(255, 255, 255, 0.3)" />
      </View>
      <View style={styles.content}>
        <View style={styles.tagContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>IN PROGRESS</Text>
          </View>
        </View>
        <Text style={styles.title}>{conference.name}</Text>
        <Text style={styles.subtitle}>{itemsScanned} Items Scanned</Text>
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Continue Picking</Text>
          <Feather name="arrow-right" size={20} color="#1976D2" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: "#E3F2FD",
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    minHeight: 200,
    position: "relative",
    overflow: "hidden",
  },
  playIconContainer: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    opacity: 0.3,
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
  tagContainer: {
    marginBottom: theme.spacing.md,
  },
  tag: {
    backgroundColor: "rgba(25, 118, 210, 0.2)",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm * 2,
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: theme.spacing.lg,
    opacity: 0.9,
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    alignSelf: "flex-start",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976D2",
  },
}));

