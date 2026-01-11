import Conference from "@/db/models/conference";
import Feather from "@expo/vector-icons/Feather";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type ConferenceStatus = "not_started" | "in_progress" | "completed";

type ConferenceCardProps = {
  conference: Conference;
  status?: ConferenceStatus;
  itemsCount?: number;
};

// Helper to determine status from conference data
function getStatus(conference: Conference): ConferenceStatus {
  // For now, compute status based on dates or use a default
  // In a real app, this would come from the database
  const now = new Date();
  const createdAt = conference.createdAt;
  const daysSinceCreation = Math.floor(
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceCreation < 1) return "not_started";
  if (daysSinceCreation < 3) return "in_progress";
  return "completed";
}

// Helper to get mock items count
function getItemsCount(conference: Conference): number {
  // For now, generate a mock count based on conference ID
  // In a real app, this would come from a relation or query
  const hash = conference.id.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return Math.abs(hash) % 20;
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  statusContainer: {
    alignItems: "flex-end",
    gap: theme.spacing.xs,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm * 2,
  },
  statusPillNotStarted: {
    backgroundColor: theme.colors.pillBackground,
  },
  statusPillInProgress: {
    backgroundColor: "#E3F2FD",
  },
  statusPillCompleted: {
    backgroundColor: "#E8F5E9",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500" as const,
  },
  statusTextNotStarted: {
    color: theme.colors.pillText,
  },
  statusTextInProgress: {
    color: "#1976D2",
  },
  statusTextCompleted: {
    color: "#388E3C",
  },
  shareIcon: {
    marginTop: theme.spacing.xs,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  metadataText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  itemsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  itemsText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  itemsCount: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  itemsUnits: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
}));

export function ConferenceCard({
  conference,
  status,
  itemsCount,
}: ConferenceCardProps) {
  const { theme } = useUnistyles();
  const resolvedStatus = status || getStatus(conference);
  const resolvedItemsCount = itemsCount ?? getItemsCount(conference);

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Get status icon and text
  const getStatusConfig = () => {
    switch (resolvedStatus) {
      case "not_started":
        return {
          icon: "circle" as const,
          text: "Not Started",
          pillStyle: styles.statusPillNotStarted,
          textStyle: styles.statusTextNotStarted,
        };
      case "in_progress":
        return {
          icon: "clock" as const,
          text: "In Progress",
          pillStyle: styles.statusPillInProgress,
          textStyle: styles.statusTextInProgress,
        };
      case "completed":
        return {
          icon: "check-circle" as const,
          text: "Completed",
          pillStyle: styles.statusPillCompleted,
          textStyle: styles.statusTextCompleted,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const placeName = conference.place?.name || "Unknown";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{conference.name}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusPill, statusConfig.pillStyle]}>
            <Feather
              name={statusConfig.icon}
              size={14}
              color={statusConfig.textStyle.color}
            />
            <Text style={[styles.statusText, statusConfig.textStyle]}>
              {statusConfig.text}
            </Text>
          </View>
          <TouchableOpacity style={styles.shareIcon}>
            <Feather
              name="share-2"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.metadata}>
        <Feather name="calendar" size={14} color={theme.colors.textSecondary} />
        <Text style={styles.metadataText}>
          {formatDate(conference.createdAt)}
        </Text>
        <Text style={styles.metadataText}>•</Text>
        <Feather name="map-pin" size={14} color={theme.colors.textSecondary} />
        <Text style={styles.metadataText}>{placeName}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.itemsSection}>
        <View style={styles.itemsLeft}>
          <Feather name="box" size={16} color={theme.colors.text} />
          <Text style={styles.itemsText}>Items Counted</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={styles.itemsCount}>{resolvedItemsCount}</Text>
          <Text style={styles.itemsUnits}>units</Text>
        </View>
      </View>
    </View>
  );
}
