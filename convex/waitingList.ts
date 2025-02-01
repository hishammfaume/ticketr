import {internalMutation, query, mutation } from "./_generated/server";
import {  v } from "convex/values";
import { WAITING_LIST_STATUS } from "./constants";

export const getQueuePosition = query({
    args: {
        eventId: v.id("events"),
        userId: v.string(),
    },
    handler: async (ctx, {eventId, userId}) => {
        //get entry for this specific user and event combination
        const entry = await ctx.db
        .query("waitingList")
        .withIndex("by_user_event", (q) => q.eq("userId", userId).eq("eventId", eventId))
        .filter((q) => q.neq(q.field("status"), WAITING_LIST_STATUS.EXPIRED))
        .first();

        //if no entry found, return null
        if(!entry) return null;


        //get total number of people ahead in line
        const peopleAhead = await ctx.db
        .query("waitingList")
        .withIndex("by_event_status", (q) => q.eq("eventId", eventId))
        .filter((q) => 
          q.and(
            //get all entries before this one
            q.lt(q.field("_creationTime"), entry._creationTime),

            ///get all entries with status waiting or offered
            q.or(
                q.eq(q.field("status"), WAITING_LIST_STATUS.WAITING),
                q.eq(q.field("status"), WAITING_LIST_STATUS.OFFERED)
            )
          )
        )
        .collect()
        .then((entries) => entries.length);

        return{
            ...entry,
            position: peopleAhead + 1
        }
    }

});
/**
 * Interbal mutation to expire a single offer and process queue for next person
 * called by scheu;e job when offer timer expires
 */
export const expireOffer = internalMutation({
    args: {
        waitingListId: v.id("waitingList"),
        eventId: v.id("events"),
    },
    handler: async (ctx, {waitingListId, eventId}) => {
        const offer = await ctx.db.get(waitingListId);
        //if offer is not found or is not in offered status, do nothing
        if (!offer || offer.status !== WAITING_LIST_STATUS.OFFERED) return;


        //mark the offer as expired
        await ctx.db.patch(waitingListId, {
            status: WAITING_LIST_STATUS.EXPIRED
        });

        await processQueue(ctx, eventId);

    }
})


export const releaseTicket = mutation({
    args: {
        eventId: v.id("events"),
        waitingListId: v.id("waitingList"),
    },
    handler: async (ctx, {eventId, waitingListId}) => {
        //update the waiting list entry to be expired
        const entry = await ctx.db.get(waitingListId);

        //you cannot relaease a ticket that has not been offered to you
        if(!entry || entry.status !== WAITING_LIST_STATUS.OFFERED){
            throw new Error("No valid ticket offer found");
        }

        //m ark the entry as expoired

        await ctx.db.patch(waitingListId,{
            status: WAITING_LIST_STATUS.EXPIRED
        });

        // TODO: process quesus to offer ticket to next person
        
    }
})