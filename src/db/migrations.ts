import { schemaMigrations } from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    {
      toVersion: 3,
      steps: [
        // Add conference_items table
        {
          type: "create_table",
          name: "conference_items",
          columns: [
            { name: "barcode", type: "string", isIndexed: true },
            { name: "asset_id", type: "string", isIndexed: true },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        },
        // Add conference_pickings table
        {
          type: "create_table",
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
        },
      ],
    },
  ],
});
