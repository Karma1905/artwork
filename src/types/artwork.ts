export interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number | null;
  date_end: number | null;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  current_page: number;
  total_pages: number;
  pageSize?: number;
}

export interface ArtworkApiResponse {
  data: Artwork[];
  pagination: PaginationInfo;
}

export interface FetchArtworksParams {
  page: number;
  pageSize: number;
}
