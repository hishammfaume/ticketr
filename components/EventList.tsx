"use client"

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'
import Spinner from './Spinner'
import { CalendarDays, Ticket } from 'lucide-react'
import EventCard from './EventCard'
import { EVENT_CATEGORIES } from '@/convex/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


type CategoryType = "Music" | "Sports" | "Art" | "Film" | "Food & Drink" | "Conference" | "Workshop" | "Other" | undefined;

type SortByType = "price_asc" | "price_desc" | "date_asc" | "date_desc" | undefined;


const EventList = () => {

  const [filters, setFilters ] = React.useState({
    category: undefined as CategoryType,
    sortBy: undefined as SortByType,
  })
    const events = useQuery(api.events.get, {
      category: filters.category,
      sortBy: filters.sortBy,
    })
    
    if (!events) {
        return (
          <div className="min-h-[400px] flex items-center justify-center">
            <Spinner />
          </div>
        )
    }

    const upcomingEvents = events
        .filter((event) => event.eventDate > Date.now())
        .sort((a,b) => b.eventDate - a.eventDate)

    const pastEvents = events
        .filter((event) => event.eventDate <= Date.now())
        .sort((a,b) => b.eventDate - a.eventDate)

   const handleCategoryChange = (value: string) => {
  setFilters({ 
    ...filters, 
    category: (value || undefined) as CategoryType 
  });
};

 const handleSortChange = (value: string) => {
  setFilters({ 
    ...filters, 
    sortBy: (value || undefined) as SortByType 
  });
};

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      
      {/*Header* */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Upcoming Events</h1>
          <p className='mt-2 text-gray-600'>Discover & book tickets for amazing events</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays className='w-5 h-5' />
            <span className='font=medium'>{upcomingEvents.length} Upcoming Events</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select
        
          onValueChange={handleCategoryChange}
          value={filters.category || ""}
         
        ><SelectTrigger>
          <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(EVENT_CATEGORIES).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        
        </Select>
        <Select
          onValueChange={handleSortChange}
          value={filters.sortBy || ""}
          
        >
          <SelectTrigger>
          <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="date_asc">Date: Oldest First</SelectItem>
            <SelectItem value="date_desc">Date: Newest First</SelectItem>
        </SelectContent>
        </Select>
      </div>

      {/**Upcoming events grid */}
      {upcomingEvents.length > 0 ? (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
        {upcomingEvents.map((event) => (
          <EventCard key={event._id} eventId={event._id} />
      ))}
      </div>) : (
      <div className='bg-gray-50 rounded-lg p-12 text-center mb-12'>
        <Ticket className='w-12 h-12 text-gray-400 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-gray-900'>
          No upcoming events
        </h3>
        <p className='text-gray-600 mt-1'>Check back later for new events</p>

      </div>
    )}

    {/**past Events section */}
    {pastEvents.length > 0 && (
      <>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>Past Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastEvents.map((event) => (
          <EventCard key={event._id} eventId={event._id} />
        ))}
      </div>
      </>
    )}
    </div>
  )
}

export default EventList