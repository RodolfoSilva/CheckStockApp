import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: "places",
      columns: [
        { name: "name", type: "string" },
        { name: "code", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "assets",
      columns: [
        { name: "name", type: "string" },
        { name: "code", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "conferences",
      columns: [
        { name: "name", type: "string" },
        { name: "place_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "conference_items",
      columns: [
        { name: "barcode", type: "string", isIndexed: true },
        { name: "asset_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "conference_pickings",
      columns: [
        { name: "conference_id", type: "string", isIndexed: true },
        { name: "asset_id", type: "string", isIndexed: true },
        { name: "conference_item_id", type: "string", isIndexed: true },
        { name: "quantity", type: "number" },
        { name: "barcode", type: "string" },
        { name: "picking_mode", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
