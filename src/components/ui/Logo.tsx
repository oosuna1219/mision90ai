import Image from "next/image";
import { cn } from "@/lib/cn";

type Variant = "mark" | "wordmark" | "wordmark-light" | "full";

const SRC: Record<Variant, string> = {
  mark: "/logos/logo-mark.png",
  wordmark: "/logos/logo-wordmark.png",
  "wordmark-light": "/logos/logo-wordmark-light.png",
  full: "/logos/logo-full.png",
};

// Intrinsic-ish ratios so next/image can reserve space without CLS.
const RATIO: Record<Variant, number> = {
  mark: 1,
  wordmark: 4.2,
  "wordmark-light": 4.2,
  full: 1.9,
};

/**
 * Brand logo. README "Marca": never recolor or recompose — always the shipped
 * asset. Pass the width; height derives from the variant's aspect ratio.
 */
export function Logo({
  variant = "wordmark",
  width,
  className,
  priority,
}: {
  variant?: Variant;
  width: number;
  className?: string;
  priority?: boolean;
}) {
  const height = Math.round(width / RATIO[variant]);
  return (
    <Image
      src={SRC[variant]}
      alt="Misión 90 AI"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto select-none", className)}
      style={{ width, height: "auto" }}
    />
  );
}
