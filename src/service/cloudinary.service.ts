import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'artists',
  ): Promise<UploadApiResponse> {
    return this.uploadFile(file, folder, 'image');
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    resource_type: 'image' | 'video' | 'raw' | 'auto' = 'auto',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type,
        },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(
    fileUrl: string,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<any> {
    try {
      const publicId = this.extractPublicIdFromUrl(fileUrl);
      if (!publicId) return null;

      return await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      // Don't throw error to avoid blocking DB delete if cloud delete fails
      return null;
    }
  }

  // Deprecated: keeping for compatibility
  async deleteImage(publicIdOrUrl: string): Promise<any> {
    // If it looks like a URL, treat it as one, otherwise assume publicId
    if (publicIdOrUrl.startsWith('http')) {
      return this.deleteFile(publicIdOrUrl, 'image');
    }
    return cloudinary.uploader.destroy(publicIdOrUrl);
  }

  private extractPublicIdFromUrl(url: string): string | null {
    if (!url) return null;

    try {
      // Example: https://res.cloudinary.com/demo/image/upload/v1612345678/folder/sample.jpg
      // Split by '/'
      const parts = url.split('/');

      // Find the index of 'upload'
      const uploadIndex = parts.indexOf('upload');

      if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) {
        return null;
      }

      // Everything after version (or 'upload' if no version) is the public_id path
      // Version starts with 'v' followed by numbers, usually at uploadIndex + 1
      let publicIdParts = parts.slice(uploadIndex + 1);

      // Remove version if present (e.g. v1612345678)
      if (
        publicIdParts[0].startsWith('v') &&
        !isNaN(Number(publicIdParts[0].substring(1)))
      ) {
        publicIdParts = publicIdParts.slice(1);
      }

      // Join back with '/'
      const publicIdWithExt = publicIdParts.join('/');

      // Remove extension
      const lastDotIndex = publicIdWithExt.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        return publicIdWithExt.substring(0, lastDotIndex);
      }

      return publicIdWithExt;
    } catch (e) {
      console.error('Error extracting publicId:', e);
      return null;
    }
  }
}
