"use client"
import React from 'react'

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStorageUrl } from "@/lib/utils";

  const formSchema = z.object({
        name: z.string().min(1, "event name is required"),
        description: z.string().min(1, "event description is required"),
        location: z.string().min(1, "event location is required"),
        eventDate: z
          .date()
          .min(
            new Date(new Date().setHours(0, 0, 0, 0)),
            "event date must be in the future"
          ),
          price: z.number().min(0, "price must be  0 or greater"),
          totalTickets: z.number().min(1, "total tickets must be 1 or greater"),
    })

    type FormData = z.infer<typeof formSchema>

    interface InitialEventData {
        _id: Id<"events">;
        name: string;
        description: string;
        location: string;
        eventDate: number;
        price: number;
        totalTickets: number;
        imageStorageId?: Id<"_storage">
    }

    interface EventFormProps {
        mode: "create" | "edit";
        initialData?: InitialEventData;
    }
const EventForm = ({mode, initialData}: EventFormProps) => {

    const { user } = useUser();
    const createEvent = useMutation(api.events.create);
    const updateEvent = useMutation(api.events.updateEvent);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const currentImageUrl = useStorageUrl(initialData?.imageStorageId);
  
  return (
    <div>EventForm</div>
  )
}

export default EventForm