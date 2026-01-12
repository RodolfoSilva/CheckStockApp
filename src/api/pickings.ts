import { database } from "@/db";
import ConferencePicking from "@/db/models/conference-picking";
import { Q } from "@nozbe/watermelondb";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

type CreatePickingData = {
  conference_id: string;
  asset_id: string;
  conference_item_id?: string;
  quantity: number;
  barcode: string;
  picking_mode: "individual" | "quantity";
};

export async function createPicking(data: CreatePickingData) {
  let createdPicking: ConferencePicking;
  await database.write(async () => {
    const conference = await database
      .get("conferences")
      .find(data.conference_id);
    const asset = await database.get("assets").find(data.asset_id);
    const conferenceItem = data.conference_item_id
      ? await database.get("conference_items").find(data.conference_item_id)
      : undefined;

    createdPicking = await database
      .get<ConferencePicking>("conference_pickings")
      .create((picking) => {
        picking.conference.set(conference);
        picking.asset.set(asset);
        if (conferenceItem) {
          picking.conferenceItem.set(conferenceItem);
        }
        picking.quantity = data.quantity;
        picking.barcode = data.barcode;
        picking.pickingMode = data.picking_mode;
        picking.createdAt = new Date();
        picking.updatedAt = new Date();
      });
  });
  console.log("Picking created:", createdPicking!.id, {
    ...data,
    pickingId: createdPicking!.id,
    conferenceId: createdPicking!.conference.id,
  });
  return createdPicking!;
}

export async function getPickingsByConference(conferenceId: string) {
  const pickings = await database
    .get<ConferencePicking>("conference_pickings")
    .query(Q.where("conference_id", conferenceId))
    .fetch();
  console.log(
    `Fetched ${pickings.length} pickings for conference ${conferenceId}`,
    pickings.map((p) => ({
      id: p.id,
      barcode: p.barcode,
      conferenceId: p.conference.id,
    }))
  );
  return pickings;
}

export const pickingsByConferenceQuery = (conferenceId: string) =>
  queryOptions({
    queryKey: ["pickings", "conference", conferenceId],
    queryFn: () => getPickingsByConference(conferenceId),
    staleTime: 0, // Always consider data stale to ensure fresh fetches
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

export function usePickingsByConference(conferenceId: string) {
  return useQuery(pickingsByConferenceQuery(conferenceId));
}

export function useCreatePicking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPicking,
    onSuccess: async (_, variables) => {
      console.log(
        "Invalidating queries for conference:",
        variables.conference_id
      );
      const queryKey = ["pickings", "conference", variables.conference_id];
      // Invalidate and immediately refetch
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });
    },
  });
}
