import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator, Pressable, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Cloudinary upload function
const uploadToCloudinary = async (imageUri: string) => {
  const cloudName = "dmlhyhowz"; // Replace with your Cloudinary cloud name
  const uploadPreset = "sample_preset"; // Replace with your upload preset name
  
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);
  formData.append('upload_preset', uploadPreset);
  
  try {
    console.log('Starting upload to Cloudinary...');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Cloudinary error:', data.error);
      throw new Error(data.error.message || 'Upload failed');
    }
    
    if (data.secure_url) {
      console.log('Upload successful!');
      console.log('Image URL:', data.secure_url);
      return data;
    } else {
      console.error('Upload failed:', data);
      throw new Error('Upload failed - no secure_url returned');
    }
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const camera = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePhoto() {
    try {
      console.log('Taking photo...');
      const result = await camera.current?.takePictureAsync();
      
      if (!result?.uri) {
        Alert.alert('Error', 'Failed to capture photo');
        return;
      }

      console.log('Photo captured:', result.uri);
      setPhoto(result.uri);
      
    } catch (error: any) {
      console.error('Photo capture error:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  }

  async function uploadPhoto() {
    if (!photo) return;

    try {
      setIsUploading(true);
      
      const result = await uploadToCloudinary(photo);
      
      Alert.alert('Success!', 'Photo uploaded to Cloudinary');
      console.log('Cloudinary URL:', result.secure_url);
      console.log('Public ID:', result.public_id);
      
      setPhoto(null);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message || 'Unknown error');
    } finally {
      setIsUploading(false);
    }
  }

  function retakePhoto() {
    setPhoto(null);
  }

  if (photo) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: photo }}
          style={styles.previewImage}
          resizeMode="contain"
        />
        <SafeAreaView edges={['bottom']} style={styles.buttonContainer}>
          <Pressable 
            style={styles.retakeButton} 
            onPress={retakePhoto}
            disabled={isUploading}
          >
            <Text style={styles.buttonText}>Retake</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.uploadButton, isUploading && styles.buttonDisabled]} 
            onPress={uploadPhoto}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Upload</Text>
            )}
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={camera} style={styles.camera} facing={facing}>
        <View style={styles.topControls}>
          <Pressable onPress={toggleCameraFacing} style={styles.flipButton}>
            <Ionicons name="camera-reverse" size={32} color="white" />
          </Pressable>
        </View>
      </CameraView>
      
      <SafeAreaView edges={['bottom']} style={styles.captureContainer}>
        <Pressable onPress={takePhoto} style={styles.captureButton} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    padding: 12,
  },
  captureContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  captureButton: {
    backgroundColor: '#fff',
    borderRadius: 40,
    width: 80,
    height: 80,
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  retakeButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#44ff44',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
