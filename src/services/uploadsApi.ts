import { api } from './apiClient';

/**
 * Phase 5 uploads. Files are sent straight to S3 via a short-lived presigned
 * PUT URL, then referenced by their object key when creating the owning record
 * (e.g. a help-request attachment). In sandbox mode (no S3 bucket on the
 * backend) the PUT is a no-op but the key/URL are real-shaped.
 */

export type UploadPurpose = 'help_attachment' | 'avatar';

export interface PresignInput {
  purpose: UploadPurpose;
  filename: string;
  contentType: string;
}

export interface Presign {
  key: string;
  uploadUrl: string;
  fileUrl: string;
  expiresIn: number;
  sandbox: boolean;
}

export interface UploadedFile {
  key: string;
  url: string;
  filename: string;
  contentType?: string;
  size?: number;
}

export const uploadsApi = {
  presign: (input: PresignInput) =>
    api.post<Presign>('/uploads/presign', input).then((r) => r.data),
};

/**
 * Presign, then PUT the bytes to S3. Returns the descriptor to attach to the
 * owning record. Skips the network PUT in sandbox mode.
 */
export async function uploadFile(
  file: { uri: string; name: string; type: string; size?: number },
): Promise<UploadedFile> {
  const presigned = await uploadsApi.presign({
    purpose: 'help_attachment',
    filename: file.name,
    contentType: file.type,
  });
  if (!presigned.sandbox) {
    const blob = await (await fetch(file.uri)).blob();
    await fetch(presigned.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: blob,
    });
  }
  return {
    key: presigned.key,
    url: presigned.fileUrl,
    filename: file.name,
    contentType: file.type,
    size: file.size,
  };
}
