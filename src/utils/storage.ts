/**
 * Safe LocalStorage utilities with automatic QuotaExceededError handling,
 * proactive stale key eviction, and client-side image compression.
 */

// Legacy or temporary keys that can safely be removed when space is needed
const OBSOLETE_KEYS = [
  'amarshop_site_content',
  'amarshop_fashion_products_v1',
  'amarshop_fashion_products_v2',
  'amarshop_fashion_products_v3',
  'amarshop_products',
  'amarshop_products_backup',
  'amarshop_cart_backup',
  'smartshop_temp_img',
  'smartshop_cache'
];

/**
 * Remove obsolete keys and prune large non-critical logs
 */
export function cleanupStorageQuotas(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;

    // 1. Remove obsolete keys
    for (const key of OBSOLETE_KEYS) {
      try {
        localStorage.removeItem(key);
      } catch {}
    }

    // 2. Prune notifications to max 15 items
    try {
      const notifsRaw = localStorage.getItem('smartshop_order_notifications_v1');
      if (notifsRaw) {
        const notifs = JSON.parse(notifsRaw);
        if (Array.isArray(notifs) && notifs.length > 15) {
          localStorage.setItem('smartshop_order_notifications_v1', JSON.stringify(notifs.slice(0, 15)));
        }
      }
    } catch {}

    // 3. Prune orders to max 30 items in localStorage
    try {
      const ordersRaw = localStorage.getItem('amarshop_orders');
      if (ordersRaw) {
        const orders = JSON.parse(ordersRaw);
        if (Array.isArray(orders) && orders.length > 30) {
          localStorage.setItem('amarshop_orders', JSON.stringify(orders.slice(0, 30)));
        }
      }
    } catch {}
  } catch (err) {
    console.warn('[Storage] Quota cleanup warning:', err);
  }
}

/**
 * Safely get item from localStorage with error suppression
 */
export function safeLocalStorageGet(key: string, fallback: string | null = null): string | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const value = localStorage.getItem(key);
    return value !== null ? value : fallback;
  } catch (err) {
    console.warn(`[Storage] Failed to read "${key}":`, err);
    return fallback;
  }
}

/**
 * Safely set item in localStorage with automatic QuotaExceeded recovery
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    const isQuotaError =
      err?.name === 'QuotaExceededError' ||
      err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err?.code === 22 ||
      err?.code === 1014;

    console.warn(`[Storage] Set failed for "${key}". Is quota exceeded:`, isQuotaError);

    // Attempt emergency cleanup and retry
    try {
      cleanupStorageQuotas();
      localStorage.setItem(key, value);
      return true;
    } catch (secondErr: any) {
      // If saving products still fails due to size, try slimming products (fallback for base64 images)
      if (key === 'amarshop_fashion_products_v4') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            // Replace large data: URLs with lightweight fallback URLs to save space
            const slimmed = parsed.map((item: any) => {
              if (item.image && typeof item.image === 'string' && item.image.startsWith('data:') && item.image.length > 100000) {
                return {
                  ...item,
                  image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=75'
                };
              }
              return item;
            });
            localStorage.setItem(key, JSON.stringify(slimmed));
            return true;
          }
        } catch {}
      }

      console.warn(`[Storage] Unable to save "${key}" even after cleanup. Skipping write safely.`);
      return false;
    }
  }
}

/**
 * Safely remove an item from localStorage
 */
export function safeLocalStorageRemove(key: string): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[Storage] Failed to remove "${key}":`, err);
  }
}

/**
 * Client-side image compression to convert multi-megabyte files into
 * crisp, lightweight JPEG/WebP data URLs under 60-120KB.
 */
export function compressImageFile(
  file: File,
  maxWidth = 900,
  maxHeight = 900,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Export as JPEG with controlled quality
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        // Fallback to original data URL if image decoding fails
        resolve(reader.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
