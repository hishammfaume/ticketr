"use client"

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const EventList = () => {
    const events = useQuery(api.events.get)
    console.log(events)
  return (
    <div>EventList</div>
  )
}

export default EventList