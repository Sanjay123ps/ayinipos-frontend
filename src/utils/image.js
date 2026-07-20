// Reads an uploaded image file, downsizes it so it doesn't blow up
// localStorage, and resolves to a compact base64 JPEG data URL that can be
// stored directly on a product (see ProductFormModal + services/api.js).
export function fileToCompressedDataUrl(file, maxDim = 640, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not decode that image'))
      img.onload = () => {
        // Never upscale — only shrink photos larger than maxDim on their
        // longest side. A typical phone photo goes from a few MB to
        // roughly 30-100KB at quality 0.82, which keeps a full catalog of
        // product photos well inside localStorage's per-origin limit.
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
        const width = Math.round(img.width * scale)
        const height = Math.round(img.height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)

        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

const BILL_IMAGE_MAX_BYTES = 5 * 1024 * 1024
const BILL_IMAGE_ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])

// Validates a supplier purchase-bill upload (JPG/JPEG/PNG/WEBP, 5MB max —
// checked on the original file, before any compression) and resolves to a
// base64 data URL. Kept at a higher resolution than product photos
// (1600px vs 640px) since a bill needs to stay legible when viewed later.
export function validateAndReadBillImage(file, maxDim = 1600, quality = 0.85) {
  if (!BILL_IMAGE_ALLOWED_TYPES.has(file.type)) {
    return Promise.reject(new Error('Unsupported file type. Please upload a JPG, PNG, or WEBP image.'))
  }
  if (file.size > BILL_IMAGE_MAX_BYTES) {
    return Promise.reject(new Error('File exceeds the 5 MB size limit.'))
  }
  return fileToCompressedDataUrl(file, maxDim, quality)
}
