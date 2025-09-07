// Types based on Jamendo API v3.0/tracks response structure
// Reference: https://developer.jamendo.com/v3.0/tracks

export interface Track {
  id: number;
  name: string;
  duration: number;
  artist_id: number;
  artist_name: string;
  artist_idstr: string;
  album_id: number;
  album_name: string;
  album_image: string;
  position: number;
  releasedate: string;
  album_datecreated: string;
  prourl: string;
  shorturl: string;
  shareurl: string;
  waveform: string;
  license_ccurl: string;
  audio: string; // Stream URL
  audiodownload: string; // Download URL
  image: string; // Track image URL
  musicinfo: MusicInfo;
  audiodownload_allowed: boolean;
}

export interface MusicInfo {
  vocalinstrumental: string;
  lang: string;
  gender: string;
  acousticelectric: string;
  speed: string;
  tags: MusicTags;
}

export interface MusicTags {
  genres: string[];
  instruments: string[];
  vartags: string[];
}

// Simplified track for list display (main screen)
export interface TrackSummary {
  id: number;
  name: string;
  artist_name: string;
  album_name: string;
  duration: number;
  image: string;
  audio: string;
}

// API Response wrapper
export interface TracksResponse {
  results: Track[];
  headers: {
    status: string;
    code: number;
    error_message: string;
    warnings: string;
    results_count: number;
    next?: string;
  };
}

// Pagination parameters
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// Search and filter parameters
export interface TrackFilters {
  search?: string;
  tags?: string;
  order?:
    | "releasedate_desc"
    | "releasedate_asc"
    | "popularity_total"
    | "name_asc"
    | "relevance";
  featured?: boolean;
}

// Combined query parameters for tracks API
export interface TracksQueryParams extends PaginationParams, TrackFilters {}
