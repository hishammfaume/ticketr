'use client'

import { SearchIcon } from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";



const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for events..."
          className="w-full py-3 px-4 pl-12 bg-white rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <SearchIcon className="absolute top-1/2 left-4 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
      </form>
    </div>
  )
}

export default SearchBar