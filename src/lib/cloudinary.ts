import { Cloudinary } from '@cloudinary/url-gen';

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'dmlhyhowz',
  },
});

export const uploadToCloudinary = async (
  file: string
): Promise<{ secure_url: string; public_id: string }> => {
  const formData = new FormData();
  
  formData.append('file', {
    uri: file,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);
  
  formData.append('upload_preset', 'photo_upload');
  
  const response = await fetch(
    'https://api.cloudinary.com/v1_1/dmlhyhowz/image/upload',
    {
      method: 'POST',
      body: formData,
    }
  );

  const result = await response.json();
  
  if (!response.ok) {
    console.error('Cloudinary error:', result);
    throw new Error(result.error?.message || 'Upload failed');
  }

  console.log('✅ Upload successful!');
  console.log('URL:', result.secure_url);
  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
};
