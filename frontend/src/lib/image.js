/**
 * Compresses an image represented as a base64 Data URL using the browser's Canvas API.
 * 
 * @param {string} base64Str - The original base64 encoded image data url.
 * @param {number} maxWidth - The maximum width threshold for resizing.
 * @param {number} maxHeight - The maximum height threshold for resizing.
 * @param {number} quality - Compression quality (between 0.0 and 1.0).
 * @returns {Promise<string>} A promise resolving to the compressed base64 JPEG data url.
 */
export function compressImage(base64Str, maxWidth = 1200, maxHeight = 1200, quality = 0.75) {
  return new Promise((resolve) => {
    if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image')) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Keep dimensions if already small
      if (width <= maxWidth && height <= maxHeight) {
        // Still run through canvas to apply compression quality
      } else {
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
      }

      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress and encode as JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        // Return original image if canvas operation fails (e.g. CORS/tainting issues, though data URLs are local)
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}
