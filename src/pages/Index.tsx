import { useState, useEffect, useCallback } from 'react';
import { ArtworkTable } from '@/components/ArtworkTable';
import { fetchArtworks } from '@/services/artworkApi';
import type { Artwork, PaginationInfo } from '@/types/artwork';

const DEFAULT_PAGE_SIZE = 12;

export default function Index() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
    current_page: 1,
    total_pages: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (page: number, pageSize: number) => {
    setLoading(true);
    const res = await fetchArtworks({ page, pageSize });
    setArtworks(res.data);
    setPagination({ ...res.pagination, pageSize });
    setLoading(false);
  }, []);

  useEffect(() => {
    load(1, DEFAULT_PAGE_SIZE);
  }, [load]);

  return (
    <div className="app-container">
      <h1>Artwork Collection</h1>
      <p>Browse and manage artwork records</p>

      <ArtworkTable
        artworks={artworks}
        pagination={pagination}
        loading={loading}
        onPageChange={load}
      />
    </div>
  );
}
