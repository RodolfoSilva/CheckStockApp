import { Model } from "@nozbe/watermelondb";
import { date, text } from "@nozbe/watermelondb/decorators";

export default class Asset extends Model {
  static table = "assets";

  @text("name") name!: string;
  @text("code") code!: string;
  @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;
}
