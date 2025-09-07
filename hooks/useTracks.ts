import { fetchTrackById, fetchTracks } from "@/services/jamendo";
import { TracksQueryParams } from "@/types/music";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const TRACKS_PER_PAGE = 20;

/**
 * Hook for fetching tracks with infinite scrolling
 * Supports both regular browsing and search functionality
 * @param params - Query parameters including optional search query
 * @param enabled - Whether the query should be enabled (default: true)
 */
export function useInfiniteTracks(
  params: Omit<TracksQueryParams, "offset"> = {},
  enabled: boolean = true
) {
  // For search queries, use relevance ordering and shorter cache times
  const isSearch = !!params.search?.trim();
  const finalParams = isSearch
    ? {
        ...params,
        order: params.order || "relevance",
      }
    : {
        ...params,
        // Default params for browsing
        featured: params.featured !== undefined ? params.featured : true,
        order: params.order || "popularity_total",
      };

  return useInfiniteQuery({
    queryKey: ["tracks", "infinite", finalParams],
    queryFn: ({ pageParam = 0 }) =>
      fetchTracks({
        ...finalParams,
        offset: pageParam,
        limit: TRACKS_PER_PAGE,
      }),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.hasMore) return undefined;
      return pages.length * TRACKS_PER_PAGE;
    },
    initialPageParam: 0,
    enabled: enabled,
    staleTime: isSearch ? 1000 * 60 * 2 : 1000 * 60 * 5, // 2 min for search, 5 min for browse
    gcTime: isSearch ? 1000 * 60 * 10 : 1000 * 60 * 30, // 10 min for search, 30 min for browse
  });
}

/**
 * Hook for fetching a paginated list of tracks (traditional pagination)
 * Supports both regular browsing and search functionality
 * @param params - Query parameters including optional search query
 */
export function useTracks(params: TracksQueryParams = {}) {
  // For search queries, use relevance ordering and shorter cache times
  const isSearch = !!params.search?.trim();
  const finalParams = isSearch
    ? {
        ...params,
        order: params.order || "relevance",
      }
    : params;

  return useQuery({
    queryKey: ["tracks", "paginated", finalParams],
    queryFn: () => fetchTracks(finalParams),
    enabled: !isSearch || !!params.search?.trim(), // Disable if search is empty
    staleTime: isSearch ? 1000 * 60 * 2 : 1000 * 60 * 5, // 2 min for search, 5 min for browse
    gcTime: isSearch ? 1000 * 60 * 10 : 1000 * 60 * 30, // 10 min for search, 30 min for browse
  });
}

/**
 * Hook for fetching a single track by ID
 */
export function useTrackById(id: number) {
  return useQuery({
    queryKey: ["track", id],
    queryFn: () => fetchTrackById(id),
    staleTime: 1000 * 60 * 10, // 10 minutes - track details change less frequently
    gcTime: 1000 * 60 * 60, // 1 hour
    enabled: !!id, // Only run query if id is provided
  });
}
