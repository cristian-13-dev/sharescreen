import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertMyProfile = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { username: args.username });
      return existing._id;
    }

    return await ctx.db.insert("profiles", {
      subject: identity.subject,
      username: args.username,
      createdAt: Date.now(),
    });
  },
});

export const myProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("profiles")
      .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
      .unique();
  },
});