import { database } from "@/db";
import Place from "@/db/models/place";
import { Q } from "@nozbe/watermelondb";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export async function getPlaces() {
  const places = await database.get<Place>("places").query().fetch();
  return places;
}

export async function getPlace(id: string) {
  const place = await database
    .get<Place>("places")
    .query(Q.where("id", id))
    .fetch();
  return place;
}

export const placesQuery = queryOptions({
  queryKey: ["places"],
  queryFn: getPlaces,
});

export const placeQuery = (id: string) =>
  queryOptions({
    queryKey: ["place", id],
    queryFn: () => getPlace(id),
  });

type CreatePlaceData = {
  name: string;
  code: string;
};

export async function createPlace(data: CreatePlaceData) {
  await database.write(async () => {
    await database.get<Place>("places").create((place) => {
      place.name = data.name;
      place.code = data.code;
      place.createdAt = new Date();
      place.updatedAt = new Date();
    });
  });
}

export function useCreatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });
}

type UpdatePlaceData = {
  id: string;
  name: string;
  code: string;
};

export async function updatePlace(data: UpdatePlaceData) {
  await database.write(async () => {
    const place = await database.get<Place>("places").find(data.id);
    await place.update((place) => {
      place.name = data.name;
      place.code = data.code;
      place.updatedAt = new Date();
    });
  });
}

export function useUpdatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });
}
