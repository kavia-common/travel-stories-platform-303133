import axiosInstance from './axiosInstance';

// PUBLIC_INTERFACE
/**
 * Upload an image to the backend upload endpoint.
 *
 * The backend may return different shapes depending on version:
 * - { imageUrl: "https://res.cloudinary.com/.../image/upload/..." } (current)
 * - { secure_url: "https://..." } (common Cloudinary style)
 * - { url: "https://..." } (fallback)
 *
 * This helper normalizes the response to always include `imageUrl`.
 *
 * @param {File} imageFile - Image file selected by the user.
 * @returns {Promise<{imageUrl: string, publicId?: string, story?: any}>} Normalized upload payload.
 */
const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const payload = response?.data || {};
    const normalizedImageUrl = payload.secure_url || payload.imageUrl || payload.url || '';

    return {
      ...payload,
      imageUrl: normalizedImageUrl,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default uploadImage;
