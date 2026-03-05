import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    roomId: v.id("rooms"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    await ctx.db.insert("messages", {
      roomId: args.roomId,
      userSubject: identity.subject,
      text: args.text,
      createdAt: Date.now(),
    });
  },
});

export const listMessages = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_roomId_createdAt", (q) => q.eq("roomId", args.roomId))
      .order("asc")
      .collect();
  },
});