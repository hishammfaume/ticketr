import { Doc } from "./_generated/dataModel";

// event categories
export const EVENT_CATEGORIES = {
    MUSIC: "Music",
    SPORTS:"Sports",
    ART:"Art",
    FILM:"Film",
    FOOD:"Food & Drink",
    CONFERENCE:"Conference",
    WORKSHOP:"Workshop",
    OTHER:"Other"
 } as const;

export type EventCategory = typeof EVENT_CATEGORIES[keyof typeof EVENT_CATEGORIES];

//Time constants in milliseconds
export const DURATIONS = {
    TICKET_OFFER: 30 * 60 * 1000  //30 minutes (minimum stripe checkout time) 
} as const;

//status tyoes for better type safety
export const WAITING_LIST_STATUS: Record<string, Doc<"waitingList">["status"]> = 
 {
    WAITING: "waiting",
    OFFERED: "offered",
    PURCHASED: "purchased",
    EXPIRED: "expired",
 } as const;

 export const TICKET_STATUS: Record<string, Doc<"tickets">["status"]> =
    {
        VALID: "valid",
        USED: "used",
        REFUNDED: "refunded",
        CANCELLED: "cancelled",
    } as const;