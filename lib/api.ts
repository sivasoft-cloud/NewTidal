const API_BASE = "https://tidal.401658.xyz";

async function fetchWithErrorHandling(url: string) {
  try {
    const response = await fetch(url, { 
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while fetching data");
    }
  }
}

export async function searchTidal(query: string, type: string = 's', quality: string = 'HI_RES') {
  try {
    const data = await fetchWithErrorHandling(`${API_BASE}/search/?${type}=${encodeURIComponent(query)}`);
    return data.items || [];
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
}

export async function getTrackDetails(trackId: string, quality: string = 'HI_RES') {
  return await fetchWithErrorHandling(`${API_BASE}/track/?id=${trackId}&quality=${quality}`);
}

export async function getCoverImage(id: string) {
  const data = await fetchWithErrorHandling(`${API_BASE}/cover/?id=${id}`);
  return data.url;
}

export async function getAlbumDetails(albumId: string) {
  return await fetchWithErrorHandling(`${API_BASE}/album/?id=${albumId}`);
}

