'use client';

/**
 * PrintButton — outline button that opens the browser's print dialog (the résumé has a dedicated A4 print
 * layout, so "Save as PDF" there gives a clean, ATS-friendly PDF in the page language).
 *
 * export default function PrintButton({ label, describedBy, className })   ('use client')
 *   label        button text (resumeUi.print)
 *   describedBy  id of a hint element → aria-describedby (e.g. the "Save as PDF" tip)
 *   className    extra class for the button
 *
 * The button itself is screen-only: its container carries data-print="hide".
 */
import Button from '../../ui/Button/Button';

export default function PrintButton({ label = 'Print', describedBy, className }) {
  return (
    <Button
      variant="outline"
      icon="printer"
      onClick={() => window.print()}
      aria-describedby={describedBy}
      className={className}
    >
      {label}
    </Button>
  );
}
