import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import imageCompression from 'browser-image-compression';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function compressImage(
  file: File,
  options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true
  }
) {
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}
