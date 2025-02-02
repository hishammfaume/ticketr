"use server"

import { api } from "@/convex/_generated/api";
import { auth} from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { stripe} from "@/lib/stripe";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function createStripeConnectCustomer() {
    const {userId} = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    //check if user has a connect account
    const existingStripeConnectId = await convex.query(
        api.users.getUserStripeConnectId,
        {
            userId
        }
    );

    if (existingStripeConnectId) {
        return {account :existingStripeConnectId};
    }

    //create a new stripe connect account
    const account = await stripe.accounts.create({
        type: "express",
        capabilities: {
            card_payments: {requested: true},
            
            transfers: {requested: true}
        }
    });

    //update user with stripe connect account
    await convex.mutation(api.users.updateOrCreateUserStripeConnectId, {
        userId,
        stripeConnectId: account.id
    });

    return {account: account.id};


}