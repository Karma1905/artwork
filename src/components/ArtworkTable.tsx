import { useMemo, useState, useCallback } from 'react';
import {
  DataTable,
  DataTablePageEvent,
  DataTableSelectionMultipleChangeEvent,
} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { RowSelectionOverlay } from './RowSelectionOverlay';
import type { Artwork, PaginationInfo } from '@/types/artwork';

interface ArtworkTableProps {
  artworks: Artwork[];
  pagination: PaginationInfo;
  loading?: boolean;
  onPageChange: (page: number, pageSize: number) => void;
}

export function ArtworkTable({
  artworks,
  pagination,
  loading = false,
  onPageChange,
}: ArtworkTableProps) {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(pagination.pageSize || 12);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deselectedIds, setDeselectedIds] = useState<Set<number>>(new Set());

  const isSelected = (a: Artwork) =>
    selectedIds.has(a.id) && !deselectedIds.has(a.id);

  const currentSelection = useMemo(
    () => artworks.filter(isSelected),
    [artworks, selectedIds, deselectedIds]
  );

  const handlePage = useCallback(
    (e: DataTablePageEvent) => {
      const page = Math.floor((e.first ?? 0) / (e.rows ?? rows)) + 1;
      setFirst(e.first ?? 0);
      setRows(e.rows ?? rows);
      onPageChange(page, e.rows ?? rows);
    },
    [onPageChange, rows]
  );

  const handleSelection = (
    e: DataTableSelectionMultipleChangeEvent<Artwork[]>
  ) => {
    const newSelected = new Set(selectedIds);
    const newDeselected = new Set(deselectedIds);

    artworks.forEach((a) => {
      const checked = e.value.some((v) => v.id === a.id);
      if (checked) {
        newSelected.add(a.id);
        newDeselected.delete(a.id);
      } else if (selectedIds.has(a.id)) {
        newSelected.delete(a.id);
        newDeselected.add(a.id);
      }
    });

    setSelectedIds(newSelected);
    setDeselectedIds(newDeselected);
  };

  return (
    <DataTable
      value={artworks}
      dataKey="id"
      selection={currentSelection}
      onSelectionChange={handleSelection}
      selectionMode="multiple"
      paginator
      lazy
      first={first}
      rows={rows}
      totalRecords={pagination.total}
      onPage={handlePage}
      loading={loading}
      rowsPerPageOptions={[12, 24, 48]}
      className="artwork-datatable"
    >
      <Column
        selectionMode="multiple"
        header={
          <RowSelectionOverlay
            onSelectRows={(c) => {
              artworks.slice(0, c).forEach((a) => selectedIds.add(a.id));
              setSelectedIds(new Set(selectedIds));
            }}
            currentPageRowCount={artworks.length}
          />
        }
        headerStyle={{ width: 50 }}
      />

      <Column
        field="title"
        header="Title"
        body={(r: Artwork) => <strong>{r.title}</strong>}
        style={{ minWidth: 240 }}
      />
      <Column field="place_of_origin" header="Place of Origin" />
      <Column
        field="artist_display"
        header="Artist"
        body={(r: Artwork) => (
          <div className="line-clamp-2" title={r.artist_display}>
            {r.artist_display || '—'}
          </div>
        )}
        style={{ minWidth: 240 }}
      />
      <Column
        field="inscriptions"
        header="Inscriptions"
        body={(r: Artwork) => (
          <div className="line-clamp-2" title={r.inscriptions}>
            {r.inscriptions || '—'}
          </div>
        )}
        style={{ minWidth: 300 }}
      />
      <Column field="date_start" header="Start" style={{ width: 110 }} />
      <Column field="date_end" header="End" style={{ width: 110 }} />
    </DataTable>
  );
}
