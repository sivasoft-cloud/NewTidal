import { Suspense } from 'react'
import SearchForm from '@/components/SearchForm'
import SearchResults from '@/components/SearchResults'
import { searchTidal } from '@/lib/api'
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

export default async function Home({
  searchParams
}: {
  searchParams: { q?: string, type?: string, quality?: string }
}) {
  const query = searchParams.q
  const type = searchParams.type || 's'
  const quality = searchParams.quality || 'HI_RES'
  
  let results = null;
  let error = null;

  if (query) {
    try {
      results = await searchTidal(query, type, quality);
    } catch (e) {
      error = e instanceof Error ? e.message : "An unknown error occurred";
      console.error("Search error:", e);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Tidal Music Search</h1>
      <SearchForm initialQuery={query} initialType={type} initialQuality={quality} />
      <Suspense fallback={<SearchResultsSkeleton />}>
        {error ? (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          results && <SearchResults results={results} type={type} />
        )}
      </Suspense>
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  )
}

