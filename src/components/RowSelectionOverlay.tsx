import { useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

interface RowSelectionOverlayProps {
  onSelectRows: (count: number) => void;
  currentPageRowCount: number;
}

export function RowSelectionOverlay({
  onSelectRows,
  currentPageRowCount,
}: RowSelectionOverlayProps) {
  const overlayRef = useRef<OverlayPanel>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);

  const handleSelect = () => {
    if (!rowCount || rowCount <= 0) return;
    onSelectRows(Math.min(rowCount, currentPageRowCount));
    setRowCount(null);
    overlayRef.current?.hide();
  };

  return (
    <>
      <Button
        icon="pi pi-sliders-h"
        className="p-button-text p-button-sm"
        onClick={(e) => overlayRef.current?.toggle(e)}
        tooltip="Select rows from current page"
      />

      <OverlayPanel ref={overlayRef}>
        <div className="overlay-content">
          <label className="overlay-label">
            Rows (max {currentPageRowCount})
          </label>

          <InputNumber
            value={rowCount}
            onValueChange={(e) => setRowCount(e.value ?? null)}
            min={1}
            max={currentPageRowCount}
            className="w-full"
          />

          <div className="overlay-actions">
            <Button
              label="Select"
              className="p-button-sm"
              onClick={handleSelect}
              disabled={!rowCount}
            />
          </div>
        </div>
      </OverlayPanel>
    </>
  );
}
