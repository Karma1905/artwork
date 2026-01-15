import type { ArtworkApiResponse, FetchArtworksParams } from '@/types/artwork';

export async function fetchArtworks(
  params: FetchArtworksParams
): Promise<ArtworkApiResponse> {
  const { page, pageSize } = params;

  const response = await fetch(
    `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${pageSize}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch artworks');
  }

  const data = await response.json();

  return {
    data: data.data,
    pagination: {
      total: data.pagination.total,
      limit: data.pagination.limit,
      offset: data.pagination.offset,
      current_page: data.pagination.current_page,
      total_pages: data.pagination.total_pages,
    },
  };
}
