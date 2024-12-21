import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";

export interface OptimizedImageProps {
  src: string;
  width?: number;
  height?: number;
  format?: "webp" | "png" | "jpeg";
  alt?: string;
}

export function OptimizedImage({
  src,
  width = 800,
  height = undefined,
  format = "webp",
  alt,
  ...prop
}: OptimizedImageProps & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
  const url = `/api/image?src=${src}&width=${width}&height=${height}&format=${format}`;

  return <img src={url} alt={alt} {...prop} />;
}