import { cn } from "@/lib/utils";

/**
 * Marca FAVX: o "F" acompanha a cor do texto ao redor (branco no escuro,
 * tinta no claro) e o "X" fica no azul da marca.
 */
export function FavxMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 546 341"
      fill="none"
      className={cn("h-7 w-auto", className)}
      aria-hidden
    >
      <g transform="translate(0 -26)">
        <path d="M26 26H371L312 93H90V147H265L206 214H90V315H26Z" fill="currentColor" />
        <path d="M430 26H520L397 172L520 315H431L348 225L272 315H176Z" fill="#2f6bff" />
      </g>
    </svg>
  );
}
