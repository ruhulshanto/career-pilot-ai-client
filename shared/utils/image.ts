/**
 * Formats a relative image path into a full public URL using the API base host.
 * 
 * @param path The relative image path (e.g., '/uploads/profile.jpg')
 * @returns The absolute URL to the image, or null if no path is provided.
 */
export const getPublicImageUrl = (path: string | null | undefined): string | null => {
  if (!path || path.trim() === '') return null;

  // If it's already an absolute URL (e.g., Google OAuth avatar), return it as is
  if (path.startsWith('http')) return path;

  // Derive the API host from the environment variable
  // Default to localhost:5000 if not set
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  // Extract the host part (e.g., 'http://localhost:5000')
  const host = apiBaseUrl.split('/api/v1')[0];

  // Ensure the path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${host}${cleanPath}`;
};
