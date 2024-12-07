'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchForm({ initialQuery = '', initialType = 's', initialQuality = 'HI_RES' }) {
  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState(initialType)
  const [quality, setQuality] = useState(initialQuality)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/?q=${encodeURIComponent(query)}&type=${type}&quality=${quality}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search query"
          className="flex-grow"
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="s">Song</SelectItem>
            <SelectItem value="a">Artist</SelectItem>
            <SelectItem value="al">Album</SelectItem>
            <SelectItem value="v">Video</SelectItem>
            <SelectItem value="p">Playlist</SelectItem>
          </SelectContent>
        </Select>
        <Select value={quality} onValueChange={setQuality}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HI_RES_LOSSLESS">Hi-Res Lossless</SelectItem>
            <SelectItem value="HI_RES">Hi-Res</SelectItem>
            <SelectItem value="LOSSLESS">Lossless</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Search</Button>
    </form>
  )
}

