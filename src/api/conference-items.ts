import { database } from "@/db";
import ConferenceItem from "@/db/models/conference-item";
import { Q } from "@nozbe/watermelondb";
import { useMutation } from "@tanstack/react-query";

type CreateConferenceItemData = {
  barcode: string;
  asset_id: string;
};

export async function createConferenceItem(data: CreateConferenceItemData) {
  let conferenceItem: ConferenceItem;
  await database.write(async () => {
    const asset = await database.get("assets").find(data.asset_id);
    conferenceItem = await database
      .get<ConferenceItem>("conference_items")
      .create((item) => {
        item.barcode = data.barcode;
        item.asset.set(asset);
        item.createdAt = new Date();
        item.updatedAt = new Date();
      });
  });
  return conferenceItem!;
}

export async function getConferenceItemByBarcode(barcode: string) {
  const items = await database
    .get<ConferenceItem>("conference_items")
    .query(Q.where("barcode", barcode))
    .fetch();
  return items[0] || null;
}

export async function getOrCreateConferenceItem(
  barcode: string,
  assetId: string
): Promise<ConferenceItem> {
  const existing = await getConferenceItemByBarcode(barcode);
  if (existing) {
    return existing;
  }
  return await createConferenceItem({ barcode, asset_id: assetId });
}

export function useCreateConferenceItem() {
  return useMutation({
    mutationFn: createConferenceItem,
  });
}
