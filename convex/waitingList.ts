import { internalMutation, query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { DURATIONS, TICKET_STATUS, WAITING_LIST_STATUS } from "./constants";
import { internal } from "./_generated/api";

export const getQueuePosition = query({
  args: {
    eventId: v.id("events"),
    userId: v.string(),
  },
  handler: async (ctx, { eventId, userId }) => {
    //get entry for this specific user and event combination
    const entry = await ctx.db
      .query("waitingList")
      .withIndex("by_user_event", (q) =>
        q.eq("userId", userId).eq("eventId", eventId)
      )
      .filter((q) => q.neq(q.field("status"), WAITING_LIST_STATUS.EXPIRED))
      .first();

    //if no entry found, return null
    if (!entry) return null;

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

    return {
      ...entry,
      position: peopleAhead + 1,
    };
  },
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
  handler: async (ctx, { waitingListId, eventId }) => {
    const offer = await ctx.db.get(waitingListId);
    //if offer is not found or is not in offered status, do nothing
    if (!offer || offer.status !== WAITING_LIST_STATUS.OFFERED) return;

    //mark the offer as expired
    await ctx.db.patch(waitingListId, {
      status: WAITING_LIST_STATUS.EXPIRED,
    });

    await processQueue(ctx, {eventId});
  },
});

/**
 * mutation to process the waiting queue and offer tickets to next eligible person
 * checks current availability considering purchased tickets and active offers
 */

export const processQueue = mutation({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");

    const { availableSpots } = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("_id"), eventId))
      .first()
      .then(async (event) => {
        if (!event) throw new Error("Event not found");

        const purchaseCount = await ctx.db
          .query("tickets")
          .withIndex("by_event", (q) => q.eq("eventId", eventId))
          .collect()
          .then(
            (tickets) =>
              tickets.filter(
                (t) =>
                  t.status === TICKET_STATUS.VALID ||
                  t.status === TICKET_STATUS.USED
              ).length
          );

        const now = Date.now();
        const activeOffers = await ctx.db
          .query("waitingList")
          .withIndex("by_event_status", (q) =>
            q.eq("eventId", eventId).eq("status", WAITING_LIST_STATUS.OFFERED)
          )
          .collect()
          .then(
            (entries) =>
                entries.filter((e) => (e.offerExpiresAt ?? 0) > now).length
          );
          
          return {
            availableSpots: event.totalTickets - (purchaseCount + activeOffers),
          }
      });

      if (availableSpots <= 0) return;

      //get next user in line
      const waitingUsers = await ctx.db
        .query("waitingList")
        .withIndex("by_event_status", (q) =>
          q.eq("eventId", eventId).eq("status", WAITING_LIST_STATUS.WAITING)
        )
        .order("asc")
        .take(availableSpots)

        //create a limited time offer for the selected user
        const now  = Date.now();

        for (const user of waitingUsers) {
            //update waiting ;ist entry to offered status
            await ctx.db.patch(user._id, {
                status: WAITING_LIST_STATUS.OFFERED,
                offerExpiresAt: now + DURATIONS.TICKET_OFFER
            });

            //schedule expiration job for this offer {cron job}
            await ctx.scheduler.runAfter(
                DURATIONS.TICKET_OFFER,
                internal.waitingList.expireOffer,
                {
                    waitingListId: user._id,
                    eventId,
                }
            )
        }
  },
});

export const releaseTicket = mutation({
  args: {
    eventId: v.id("events"),
    waitingListId: v.id("waitingList"),
  },
  handler: async (ctx, { eventId, waitingListId }) => {
    //update the waiting list entry to be expired
    const entry = await ctx.db.get(waitingListId);

    //you cannot relaease a ticket that has not been offered to you
    if (!entry || entry.status !== WAITING_LIST_STATUS.OFFERED) {
      throw new Error("No valid ticket offer found");
    }

    //m ark the entry as expoired

    await ctx.db.patch(waitingListId, {
      status: WAITING_LIST_STATUS.EXPIRED,
    });

    // TODO: process quesus to offer ticket to next person
    await processQueue(ctx, {eventId});
  },
});
