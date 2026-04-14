/**
 * Resolves an image URL stored in the database to the correct public URL.
 * Uploaded images may be stored with a server-side base URL (e.g. http://localhost:5000/uploads/...).
 * This function rewrites the base to NEXT_PUBLIC_API_URL so the browser always
 * requests the image from the correct server in every environment.
 */
export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return '';
  if (imageUrl.includes('/uploads/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const uploadsPath = imageUrl.substring(imageUrl.indexOf('/uploads/'));
    return `${apiUrl}${uploadsPath}`;
  }
  return imageUrl;
}
