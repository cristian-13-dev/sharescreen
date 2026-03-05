import { mutation } from "./_generated/server";

export const ensureGeneralRoom = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("rooms").first();
    if (existing) return existing._id;
    return await ctx.db.insert("rooms", { name: "general", createdAt: Date.now() });
  },
});