import Image from "next/image";
import logoUrl from "../logo-iceflower.svg";

export interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  height?: number;
}

const RATIO = 1293 / 482;

export function Logo({ variant = "light", className = "", height = 32 }: LogoProps) {
  const src = typeof logoUrl === "string" ? logoUrl : logoUrl.src;
  const width = Math.round(height * RATIO);
  const tone = variant === "dark" ? "brightness-0 invert" : "";

  return (
    <Image
      src={src}
      alt="IceFlower"
      width={width}
      height={height}
      unoptimized
      className={`${tone} ${className}`}
    />
  );
}
