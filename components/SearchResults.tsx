import Link from 'next/link'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SearchResult {
  id: number;
  title: string;
  name?: string;
  duration?: number;
  artist?: {
    name: string;
  };
  album?: {
    title: string;
  };
  audioQuality?: string;
  explicit?: boolean;
  url?: string;
}

export default function SearchResults({ results, type }: { results: SearchResult[], type: string }) {
  if (!results || results.length === 0) {
    return <p className="mt-8 text-center text-lg">No results found.</p>
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardContent className="flex-grow p-4">
              <h3 className="text-xl font-semibold mb-2">{item.title || item.name}</h3>
              {type === 's' && (
                <>
                  <p className="text-sm text-muted-foreground">Artist: {item.artist?.name}</p>
                  <p className="text-sm text-muted-foreground">Album: {item.album?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">Quality: {item.audioQuality}</p>
                  {item.explicit && <p className="text-sm text-red-500">Explicit</p>}
                </>
              )}
              {type === 'a' && (
                <p className="text-sm text-muted-foreground">Artist</p>
              )}
              {type === 'al' && (
                <p className="text-sm text-muted-foreground">Album by {item.artist?.name}</p>
              )}
              {type === 'v' && (
                <p className="text-sm text-muted-foreground">Video</p>
              )}
              {type === 'p' && (
                <p className="text-sm text-muted-foreground">Playlist</p>
              )}
            </CardContent>
            <CardFooter className="p-4">
              <Link href={`/${type}/${item.id}`} passHref>
                <Button className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

