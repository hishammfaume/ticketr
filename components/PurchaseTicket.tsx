"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import ReleaseTicket from "./ReleaseTicket";

const PurchaseTicket = ({ eventId }: { eventId: Id<"events"> }) => {
  const router = useRouter();
  const { user } = useUser();
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const offerExpiresAt = queuePosition?.offerExpiresAt ?? 0;
  const isExpired = offerExpiresAt < Date.now();

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (isExpired) {
        setTimeRemaining("Expired");
        return;
      }

      const diff = offerExpiresAt - Date.now(); // get the difference between the current time and the offer expiration time
      const minutes = Math.floor(diff / 1000 / 60); // get the remaining minutes
      const seconds = Math.floor((diff / 1000) % 60); // get the remaining seconds

      if (minutes > 0) {
        setTimeRemaining(
          `${minutes} minute${minutes === 1 ? "" : "s"} ${seconds} second${seconds === 1 ? "" : "s"}` // format the time remaining
        );
      } else {
        setTimeRemaining(`${seconds} second${seconds === 1 ? "" : "s"}`); // format the time remaining
      }
    };
    calculateTimeRemaining();

    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [offerExpiresAt, isExpired]);

  // create stripe checkout...
  const handlePurchase = async () => {};

  if (!user || !queuePosition || queuePosition.status !== "offered") {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ticket Reserved
                  </h3>
                  <p className="text-sm text-gray-500">
                    Expires in {timeRemaining}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                A ticket has been reserved for you. Complete your purchase
                before the timer runs out to secure your spot at this event.
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handlePurchase}
          disabled={isLoading || isExpired}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg font-bold shadow-md hover:from-amber-600 hover:to-amber-700 transform hover:scale-[1.02] transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
        >
          {isLoading
            ? "Redirecting to checkout..."
            : "Purchase Your Ticket Now →"}
        </button>

        <div className="mt-4">
          <ReleaseTicket eventId={eventId} waitingListId={queuePosition._id} />
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicket;
