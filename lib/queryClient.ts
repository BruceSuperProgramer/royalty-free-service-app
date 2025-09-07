import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data is considered fresh
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Time in milliseconds that unused/inactive data remains in cache
      gcTime: 1000 * 60 * 30, // 30 minutes (previously called cacheTime)
      // Retry failed requests up to 3 times
      retry: 3,
      // Refetch on window focus
      refetchOnWindowFocus: false,
    },
  },
});
