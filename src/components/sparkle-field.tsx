import { cn } from "@/lib/utils";

/** Azul → azul meia-noite, com um sopro de ciano (Nexus AI) */
export const SPARKLE_BLUE =
  "linear-gradient(120deg,#191970 0%,#2f6bff 28%,#7cc7ff 44%,#22d3ee 56%,#2f6bff 74%,#191970 100%)";

/** Azul → laranja, a paleta do Construtor de IA */
export const SPARKLE_ORANGE =
  "linear-gradient(120deg,#191970 0%,#2f6bff 24%,#ff3c00 42%,#ff5a14 55%,#7cc7ff 74%,#2f6bff 100%)";

/**
 * Textura animada das molduras: uma grade de brilhos de 4 pontas recortada
 * sobre um degradê que corre devagar. Duas grades deslocadas meio ladrilho
 * entre si dão profundidade e o cintilar.
 */
export function SparkleField({
  gradient,
  className,
  /** Degradê que apaga a textura em uma das pontas do cartão */
  fade = "linear-gradient(160deg, rgba(0,0,0,0.55) 0%, #000 45%)",
}: {
  gradient: string;
  className?: string;
  fade?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ WebkitMaskImage: fade, maskImage: fade }}
    >
      <div className="sparkle-field absolute inset-0" style={{ backgroundImage: gradient }} />
      <div className="sparkle-field-soft absolute inset-0" style={{ backgroundImage: gradient }} />
    </div>
  );
}
