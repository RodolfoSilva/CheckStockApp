import { database } from "@/db";
import Conference from "@/db/models/conference";
import { Q } from "@nozbe/watermelondb";
import { queryOptions, useMutation } from "@tanstack/react-query";

export async function getConferences() {
  const conferences = await database
    .get<Conference>("conferences")
    .query()
    .fetch();
  return conferences;
}

export async function getConference(id: string) {
  const conferences = await database
    .get<Conference>("conferences")
    .query(Q.where("id", id))
    .fetch();
  return conferences[0] || null;
}

export const conferencesQuery = queryOptions({
  queryKey: ["conferences"],
  queryFn: getConferences,
});

export const conferenceQuery = (id: string) =>
  queryOptions({
    queryKey: ["conference", id],
    queryFn: () => getConference(id),
  });

type CreateConferenceData = {
  name: string;
  place_id: string;
};

export async function createConference(data: CreateConferenceData) {
  let createdConference: Conference;
  await database.write(async () => {
    const place = await database.get("places").find(data.place_id);
    createdConference = await database
      .get<Conference>("conferences")
      .create((conference) => {
        conference.name = data.name;
        conference.place.set(place);
        conference.createdAt = new Date();
        conference.updatedAt = new Date();
      });
  });
  return createdConference!;
}

export function useCreateConference() {
  return useMutation({
    mutationFn: createConference,
    meta: {
      invalidates: [conferencesQuery.queryKey],
    },
  });
}
