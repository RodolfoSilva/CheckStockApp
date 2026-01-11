import { Model } from "@nozbe/watermelondb";
import { date, relation, text } from "@nozbe/watermelondb/decorators";
import Place from "./place";

export default class Conference extends Model {
  static table = "conferences";

  @text("name") name!: string;
  @relation("place", "place_id") place!: Place;
  @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;
}
