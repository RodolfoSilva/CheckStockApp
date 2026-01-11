import { database } from "@/db";
import Asset from "@/db/models/asset";
import { Q } from "@nozbe/watermelondb";
import { queryOptions, useMutation } from "@tanstack/react-query";

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

type CreateAssetData = {
  name: string;
  code: string;
};

export async function createAsset(data: CreateAssetData) {
  await database.write(async () => {
    await database.get<Asset>("assets").create((asset) => {
      asset.name = data.name;
      asset.code = data.code;
      asset.createdAt = new Date();
      asset.updatedAt = new Date();
    });
  });
}

export function useCreateAsset() {
  return useMutation({
    mutationFn: createAsset,
    meta: {
      invalidates: [assetsQuery.queryKey],
    },
  });
}

type UpdateAssetData = {
  id: string;
  name: string;
  code: string;
};

export async function updateAsset(data: UpdateAssetData) {
  await database.write(async () => {
    const asset = await database.get<Asset>("assets").find(data.id);
    await asset.update((asset) => {
      asset.name = data.name;
      asset.code = data.code;
      asset.updatedAt = new Date();
    });
  });
}

export function useUpdateAsset() {
  return useMutation({
    mutationFn: updateAsset,
    meta: {
      invalidates: [assetsQuery.queryKey],
    },
  });
}
