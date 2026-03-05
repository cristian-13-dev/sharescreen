import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,

  profiles: defineTable({
    subject: v.string(),        // identity.subject
    username: v.string(),
    createdAt: v.number(),
  })
    .index("by_subject", ["subject"])
    .index("by_username", ["username"]),

  rooms: defineTable({
    name: v.optional(v.string()),
    createdAt: v.number(),
  }),

  roomMembers: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    joinedAt: v.number(),
  })
    .index("by_roomId", ["roomId"])
    .index("by_roomId_userId", ["roomId", "userId"])
    .index("by_userId", ["userId"]),

  messages: defineTable({
    roomId: v.id("rooms"),
    userSubject: v.string(),
    text: v.string(),
    createdAt: v.number(),
  })
    .index("by_roomId", ["roomId"])
    .index("by_roomId_createdAt", ["roomId", "createdAt"]),

  calls: defineTable({
    roomId: v.id("rooms"),
    startedAt: v.number(),
    endedAt: v.union(v.number(), v.null()),
    screenSharerUserId: v.union(v.id("users"), v.null()),
  }).index("by_roomId", ["roomId"]),

  webrtcSignals: defineTable({
    callId: v.id("calls"),
    roomId: v.id("rooms"),
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    type: v.union(v.literal("offer"), v.literal("answer"), v.literal("ice")),
    payload: v.any(),
    createdAt: v.number(),
  })
    .index("by_callId", ["callId"])
    .index("by_toUserId_callId", ["toUserId", "callId"]),
});