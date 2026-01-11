import { database } from "@/db";
import Asset from "@/db/models/asset";
import { Q } from "@nozbe/watermelondb";
import { queryOptions } from "@tanstack/react-query";

export async function getAssets() {
  const assets = await database.get<Asset>("assets").query().fetch();
  return assets;
}

export async function getAsset(id: string) {
  const asset = await database
    .get<Asset>("assets")
    .query(Q.where("id", id))
    .fetch();
  return asset;
}

export const assetsQuery = queryOptions({
  queryKey: ["assets"],
  queryFn: getAssets,
});

export const assetQuery = (id: string) =>
  queryOptions({
    queryKey: ["asset", id],
    queryFn: () => getAsset(id),
  });
