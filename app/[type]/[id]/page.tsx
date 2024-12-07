import { getTrackDetails, getCoverImage, getAlbumDetails } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

export default async function DetailsPage({ params }: { params: { type: string, id: string } }) {
  const { type, id } = params
  let details;
  let coverUrl;
  let error = null;

  try {
    switch (type) {
      case 's':
        details = await getTrackDetails(id);
        coverUrl = await getCoverImage(id);
        break;
      case 'al':
        details = await getAlbumDetails(id);
        coverUrl = await getCoverImage(id);
        break;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "An unknown error occurred";
    console.error("Details page error:", e);
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{details.title || details.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <div>
            {coverUrl && <Image src={coverUrl} alt={details.title || details.name} width={300} height={300} className="rounded-lg shadow-lg" />}
          </div>
          <div className="space-y-4">
            {type === 's' && (
              <>
                <p><strong>Artist:</strong> {details.artist.name}</p>
                <p><strong>Album:</strong> {details.album.title}</p>
                <p><strong>Duration:</strong> {Math.floor(details.duration / 60)}:{(details.duration % 60).toString().padStart(2, '0')}</p>
                <p><strong>Quality:</strong> {details.audioQuality}</p>
                {details.explicit && <Badge variant="destructive">Explicit</Badge>}
                <div className="space-y-2">
                  <p><strong>Audio Modes:</strong></p>
                  {details.audioModes.map((mode: string) => (
                    <Badge key={mode} variant="secondary" className="mr-2">{mode}</Badge>
                  ))}
                </div>
              </>
            )}
            {type === 'al' && (
              <>
                <p><strong>Artist:</strong> {details.artist.name}</p>
                <p><strong>Number of Tracks:</strong> {details.numberOfTracks}</p>
                <p><strong>Release Date:</strong> {details.releaseDate}</p>
              </>
            )}
            {details.copyright && <p><strong>Copyright:</strong> {details.copyright}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/" passHref>
            <Button variant="outline">Back to Search</Button>
          </Link>
          {details.url && (
            <a href={details.url} target="_blank" rel="noopener noreferrer">
              <Button>Open in Tidal</Button>
            </a>
          )}
          {details.OriginalTrackUrl && (
            <a href={details.OriginalTrackUrl} download>
              <Button variant="secondary">Download Original Track</Button>
            </a>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

