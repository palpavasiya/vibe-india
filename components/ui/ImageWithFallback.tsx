"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fill,
  className,
  priority,
  sizes,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={cn(
          "bg-black/80",
          fill ? "absolute inset-0" : "w-full h-full",
          className
        )}
        aria-label={alt}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={cn("object-cover", className)}
      priority={priority}
      sizes={sizes}
      onError={() => setError(true)}
    />
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
