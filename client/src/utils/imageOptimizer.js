/**
 * Professional image optimization utility for Supabase Storage images
 * Handles WebP conversion, responsive sizing, and quality optimization
 */

/**
 * Optimize Supabase image URL with transformation parameters
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 * @param {number} options.width - Desired width in pixels
 * @param {number} options.quality - Image quality (0-100), default 75
 * @param {string} options.format - Image format ('webp', 'jpeg'), default 'webp'
 * @returns {string} Optimized image URL
 */
export function optimizeImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') {
    return url;
  }

  const {
    width,
    quality = 75,
    format = 'webp',
  } = options;

  // If it's not a Supabase Storage URL, return as-is
  if (!url.includes('supabase.co/storage/v1/object/public/')) {
    return url;
  }

  // Parse URL and add transformation parameters
  try {
    const urlObj = new URL(url);
    
    if (width) {
      urlObj.searchParams.set('width', width.toString());
    }
    urlObj.searchParams.set('quality', quality.toString());
    if (format === 'webp') {
      urlObj.searchParams.set('format', 'webp');
    }

    return urlObj.toString();
  } catch (e) {
    // Fallback for URL parsing errors
    const separator = url.includes('?') ? '&' : '?';
    const params = [];
    
    if (width) {
      params.push(`width=${width}`);
    }
    params.push(`quality=${quality}`);
    if (format === 'webp') {
      params.push(`format=webp`);
    }
    
    return `${url}${separator}${params.join('&')}`;
  }
}

/**
 * Generate responsive srcset for Supabase images
 * @param {string} url - Original image URL
 * @param {Object} breakpoints - Width breakpoints
 * @param {number} quality - Image quality
 * @returns {string} srcset string
 */
export function generateSrcset(url, breakpoints = { small: 400, medium: 800, large: 1200 }, quality = 75) {
  if (!url || !url.includes('supabase.co')) {
    return '';
  }

  const srcsetParts = Object.entries(breakpoints).map(([name, width]) => {
    const optimizedUrl = optimizeImageUrl(url, { width, quality, format: 'webp' });
    return `${optimizedUrl} ${width}w`;
  });

  return srcsetParts.join(', ');
}

/**
 * Generate sizes attribute for responsive images
 * @param {Object} sizes - Media query sizes
 * @returns {string} sizes attribute
 */
export function generateSizes(sizes = {
  '(max-width: 640px)': '100vw',
  '(max-width: 1024px)': '50vw',
  '(min-width: 1025px)': '33vw',
}) {
  const sizeParts = Object.entries(sizes).map(
    ([query, size]) => `${query} ${size}`
  );
  sizeParts.push('100vw'); // Default fallback
  return sizeParts.join(', ');
}

/**
 * Get optimized preview image URL (for listing cards)
 * Uses: width=600, quality=60, format=webp
 */
export function getPreviewImageUrl(url) {
  return optimizeImageUrl(url, { width: 600, quality: 60, format: 'webp' });
}

/**
 * Get optimized main image URL (for property detail pages)
 * Uses: width=1200, quality=75, format=webp
 */
export function getMainImageUrl(url) {
  return optimizeImageUrl(url, { width: 1200, quality: 75, format: 'webp' });
}

