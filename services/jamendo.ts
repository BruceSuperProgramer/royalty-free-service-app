/**
 * Jamendo API Service
 *
 * Optimization Strategy:
 * - List fetches: Only essential fields, no includes to minimize bandwidth
 * - Detail fetches: Full metadata including musicinfo for comprehensive track details
 * - Uses TrackSummary interface for efficient list display
 */
import {
  Track,
  TracksQueryParams,
  TracksResponse,
  TrackSummary,
} from "@/types/music";

const BASE_URL = process.env.EXPO_PUBLIC_JAMENDO_API_BASE_URL;
const CLIENT_ID = process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID;

if (!CLIENT_ID) {
  console.error(
    "EXPO_PUBLIC_JAMENDO_CLIENT_ID is not set in environment variables"
  );
}

if (!BASE_URL) {
  console.error("EXPO_PUBLIC_JAMENDO_API_BASE_URL is not set, using default");
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params: Record<string, any>): string {
  const url = new URL(`${BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Convert full Track to TrackSummary for list display
 */
function trackToSummary(track: Track): TrackSummary {
  return {
    id: track.id,
    name: track.name,
    artist_name: track.artist_name,
    album_name: track.album_name,
    duration: track.duration,
    image: track.image,
    audio: track.audio,
  };
}

/**
 * Fetch tracks from Jamendo API
 * Only loads essential fields for list display to minimize data usage
 * Uses simple pagination: hasMore is true if we receive a full page of results
 */
export async function fetchTracks(params: TracksQueryParams = {}): Promise<{
  tracks: TrackSummary[];
  totalCount: number;
  hasMore: boolean;
}> {
  if (!CLIENT_ID) {
    throw new Error("Jamendo client ID is not configured");
  }

  const queryParams = {
    client_id: CLIENT_ID,
    format: "json",
    limit: params.limit || 20,
    offset: params.offset || 0,
    // Filter parameters
    ...(params.search && { search: params.search }),
    ...(params.tags && { tags: params.tags }),
    ...(params.order && { order: params.order }),
    ...(params.featured !== undefined && { featured: params.featured ? 1 : 0 }),
    // Default to featured tracks for better quality
    featured: params.featured !== undefined ? (params.featured ? 1 : 0) : 1,
    // Default order by popularity
    order: params.order || "popularity_total",
  };

  const url = buildUrl("/tracks", queryParams);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TracksResponse = await response.json();

    if (data.headers.code !== 0) {
      throw new Error(
        `API error: ${data.headers.error_message || "Unknown error"}`
      );
    }

    const tracks = data.results.map(trackToSummary);
    const totalCount = data.headers.results_count;
    const currentLimit = params.limit || 20;

    // Determine if there are more results based on the number of tracks returned
    // If we get fewer tracks than requested, we've reached the end
    // If we get exactly the limit, there might be more (we'll find out on next request)
    const hasMore = tracks.length === currentLimit;

    return {
      tracks,
      totalCount,
      hasMore,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch a single track with full details
 * Includes all metadata for the detailed track view
 */
export async function fetchTrackById(id: number): Promise<Track> {
  if (!CLIENT_ID) {
    throw new Error("Jamendo client ID is not configured");
  }

  const queryParams = {
    client_id: CLIENT_ID,
    format: "json",
    id: id.toString(),
    // Include all metadata for detailed view
    include: "musicinfo",
  };

  const url = buildUrl("/tracks", queryParams);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TracksResponse = await response.json();

    if (data.headers.code !== 0) {
      throw new Error(
        `API error: ${data.headers.error_message || "Unknown error"}`
      );
    }

    if (data.results.length === 0) {
      throw new Error("Track not found");
    }

    return data.results[0];
  } catch (error) {
    throw error;
  }
}
