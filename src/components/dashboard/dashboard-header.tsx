import { assetsQuery } from "@/api/assets";
import { conferencesQuery } from "@/api/conferences";
import { placesQuery } from "@/api/places";
import Conference from "@/db/models/conference";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import CurrentActivityCard from "./current-activity-card";
import MetricCard from "./metric-card";

type ConferenceStatus = "not_started" | "in_progress" | "completed";

// Helper to determine status from conference data
// Reused from conference-card.tsx
function getStatus(conference: Conference): ConferenceStatus {
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
// Reused from conference-card.tsx
function getItemsCount(conference: Conference): number {
  const hash = conference.id.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return Math.abs(hash) % 20;
}

export default function DashboardHeader() {
  const { data: assets = [] } = useQuery(assetsQuery);
  const { data: places = [] } = useQuery(placesQuery);
  const { data: conferences = [] } = useQuery(conferencesQuery);

  // Calculate metrics
  const productsCount = assets.length;
  const addressesCount = places.length;

  const completedCount = conferences.filter(
    (conf) => getStatus(conf) === "completed"
  ).length;

  const pendingCount = conferences.filter(
    (conf) => getStatus(conf) === "not_started"
  ).length;

  // Find first in-progress conference
  const currentActivity = conferences.find(
    (conf) => getStatus(conf) === "in_progress"
  );

  const itemsScanned = currentActivity ? getItemsCount(currentActivity) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Logistics Overview</Text>
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard
          icon="box"
          value={productsCount}
          label="PRODUCTS"
          iconColor="#1976D2"
          iconBackgroundColor="#E3F2FD"
        />
        <MetricCard
          icon="map-pin"
          value={addressesCount}
          label="ADDRESSES"
          iconColor="#388E3C"
          iconBackgroundColor="#E8F5E9"
        />
        <MetricCard
          icon="check-circle"
          value={completedCount}
          label="COMPLETED"
          iconColor="#9BA1A6"
          iconBackgroundColor="#F1F3F5"
        />
        <MetricCard
          icon="clock"
          value={pendingCount}
          label="PENDING"
          iconColor="#FF9800"
          iconBackgroundColor="#FFF3E0"
        />
      </View>

      <View>
        <Text style={styles.activityTitle}>Current Activity</Text>
        {currentActivity && (
          <CurrentActivityCard
            conference={currentActivity}
            itemsScanned={itemsScanned}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
}));
