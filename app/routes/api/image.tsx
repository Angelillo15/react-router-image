import type { LoaderFunction } from "react-router";
import fs from "fs/promises";
import sharp from "sharp";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const src = url.searchParams.get("src")?.startsWith("/public/") ? url.searchParams.get("src")?.replace("/public/", "") : url.searchParams.get("src");
  
  if (!src) {
    return new Response("Missing src parameter", { status: 400 });
  }

  const width = Number(url.searchParams.get("width")) || undefined;
  const height = Number(url.searchParams.get("height")) || undefined;
  const format = url.searchParams.get("format") || "webp";

  const cachedImageFolder = `optimized/${height}x${width}/`;
  const cachedImagePath = `${cachedImageFolder}${src.replace(/\//g, "_")}.${format}`;

  try {
    const originalImagePath = `./public/${src}`;
    
    // Validate if the source image exists
    await fs.access(originalImagePath);
    
    // Get original image metadata
    const metadata = await sharp(originalImagePath).metadata();

    if (!metadata.width || !metadata.height) {
      return new Response("Invalid source image", { status: 400 });
    }

    // Check for upscaling
    if ((width && width > metadata.width) || (height && height > metadata.height)) {
      return new Response("Upscaling not allowed", { status: 400 });
    }

    // Check if the image is already cached
    await fs.access(`./public/${cachedImagePath}`);
    const cachedImage = await fs.readFile(`./public/${cachedImagePath}`);

    return new Response(cachedImage, {
      headers: {
        "Content-Type": `image/${format}`,
      },
    });
  } catch {
    const buffer = await sharp(`./public/${src}`)
      .resize(width || null, height || null)
      .toFormat(format as keyof sharp.FormatEnum)
      .toBuffer();

    await fs.mkdir(`./public/${cachedImageFolder}`, { recursive: true });
    await fs.writeFile(`./public/${cachedImagePath}`, buffer);

    return new Response(buffer, {
      headers: {
        "Content-Type": `image/${format}`,
        "Cache-Control": "public, s-maxage=31536000, max-age=31536000",
      },
    });
  }
};
