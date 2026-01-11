import { Model } from "@nozbe/watermelondb";
import { date, text } from "@nozbe/watermelondb/decorators";

export default class Place extends Model {
  static table = "places";

  @text("name") name!: string;
  @text("code") code!: string;
  @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;
}
