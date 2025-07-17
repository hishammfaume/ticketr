
import {defineSchema, defineTable} from 'convex/server';
import {v } from 'convex/values';
import { EVENT_CATEGORIES } from './constants';

export default defineSchema({
    events: defineTable({
        name: v.string(),
        description: v.string(),
        location: v.string(),
        eventDate: v.number(),
        price: v.number(),
        totalTickets: v.number(),
        userId: v.string(),
        imageStorageId: v.optional(v.id("_storage")),
        is_cancelled: v.optional(v.boolean()),
        category: v.union(
            v.literal(EVENT_CATEGORIES.MUSIC),
            v.literal(EVENT_CATEGORIES.SPORTS),
            v.literal(EVENT_CATEGORIES.ART),
            v.literal(EVENT_CATEGORIES.FILM),
            v.literal(EVENT_CATEGORIES.FOOD),
            v.literal(EVENT_CATEGORIES.CONFERENCE),
            v.literal(EVENT_CATEGORIES.WORKSHOP),
            v.literal(EVENT_CATEGORIES.OTHER)
        ),
    })
    .index("by_user", ["userId"])
    .index("by_event_date", ["eventDate"])
    .index("by_category", ["category"])
    
    ,
    tickets: defineTable({
        eventId: v.id("events"),
        userId: v.string(),
        purchasedAt:v.number(),
        status: v.union(
            v.literal("valid"),
            v.literal("used"),
            v.literal("refunded"),
            v.literal("cancelled"),
        ),
        paymentIntentId: v.optional(v.string()),// used to refund the user in case of a cancelled event
        amount: v.number(),
    })

    // create indexes to make seaching the database faster
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_user_event", ["userId", "eventId"])
    .index("by_payment_intent", ["paymentIntentId"]),

    //create the waiting list Table
    waitingList: defineTable({
        eventId: v.id("events"),
        userId: v.string(),
        status: v.union(
            v.literal("waiting"),
            v.literal("offered"),
            v.literal("purchased"),
            v.literal("expired"),
        ),
        offerExpiresAt: v.optional(v.number()),
    })

    .index("by_event_status",["eventId", "status"])
    .index("by_user_event", ["userId", "eventId"])
    .index("by_user", ["userId"]),

    // create the user table
    users : defineTable({
        name: v.string(),
        email: v.string(),
        userId: v.string(),
        stripeConnectId: v.optional(v.string()),
    })

    .index("by_user_id", ["userId"])
    .index("by_email", ["email"]),
    

})