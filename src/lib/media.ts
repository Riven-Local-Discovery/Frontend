/**
 * Image uploads. Two steps, because the API never takes the bytes itself:
 * POST /media/upload-url signs a PUT straight to object storage, then the
 * browser uploads to that URL.
 *
 * The signature covers Content-Type, so the PUT has to send exactly the type
 * that was asked for — a mismatch is rejected by the store, not by us. The
 * key is namespaced per user and ends in a fresh uuid, so an upload can never
 * overwrite anything.
 */

import { ApiError, apiRequest } from './api';
import { loadSession } from './auth';

/** What the image is for. Decides the key prefix on the storage side. */
export type UploadPurpose = 'PRODUCT_IMAGE' | 'VENDOR_LOGO' | 'VENDOR_COVER' | 'BAZAAR_COVER';

/** The only types the API will sign. */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export function isAllowedImageType(type: string): type is AllowedImageType {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type);
}

type UploadTarget = {
  uploadUrl: string;
  /** Where the object is readable once uploaded — this is what gets stored. */
  publicUrl: string;
  key: string;
  expiresInSeconds: number;
};

/**
 * Uploads one file and resolves with the URL to store on the entity.
 *
 * There is no size limit on the signed PUT, so this one is enforced client
 * side. That is a convenience, not a control — the cap belongs on the bucket.
 */
export async function uploadImage(
  file: File,
  purpose: UploadPurpose,
  maxBytes = 5 * 1024 * 1024,
): Promise<string> {
  if (!isAllowedImageType(file.type)) {
    throw new ApiError(0, 'UNSUPPORTED_IMAGE_TYPE', 'Use a JPEG, PNG or WebP image.');
  }
  if (file.size > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024));
    throw new ApiError(0, 'IMAGE_TOO_LARGE', `That image is larger than ${mb} MB.`);
  }

  const target = await apiRequest<UploadTarget>('/media/upload-url', {
    method: 'POST',
    body: { purpose, contentType: file.type },
    token: loadSession()?.accessToken ?? null,
  });

  let response: Response;
  try {
    response = await fetch(target.uploadUrl, {
      method: 'PUT',
      // Must match the signed type exactly, and must not carry the API's
      // Authorization header — the signature is in the URL.
      headers: { 'Content-Type': file.type },
      body: file,
    });
  } catch (cause) {
    throw new ApiError(0, 'UPLOAD_NETWORK_ERROR', 'Could not reach the image store.', cause);
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      'UPLOAD_REJECTED',
      `The image store rejected the upload (${response.status}).`,
    );
  }

  return target.publicUrl;
}
