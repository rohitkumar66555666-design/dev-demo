import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { supabase } from '../../../lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { insertAsset } from '../../../api/assets';
import { useAuth } from '../../../provider/authprovider';
import { Ionicons } from '@expo/vector-icons';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const cameraRef = useRef<Camera>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const insertAssetMutation = useMutation({
    mutationFn: (assetId: string) =>
      insertAsset({ event_id: id, user_id: user?.id, asset_id: assetId }),
    onSuccess: () => {
      Alert.alert('Success!', 'Photo uploaded to Supabase Storage');
      router.back(); // Go back to the event screen after successful upload
    },
    onError: (error: any) => {
      Alert.alert('Upload Failed', error.message || 'Unknown error');
    }
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setCapturedPhoto(photo.uri);
    }
  }

  async function uploadPhoto() {
    if (!capturedPhoto) return;

    setIsUploading(true);
    try {
      const response = await fetch(capturedPhoto);
      const blob = await response.blob();
      const fileName = `photo_${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from('photos')
        .upload(fileName, blob, { contentType: 'image/jpeg' });

      if (error) throw error;
      
      insertAssetMutation.mutate(data.path);

    } catch (error: any) {
      Alert.alert('Upload Failed', error.message || 'Unknown error');
    } finally {
      setIsUploading(false);
    }
  }

  if (hasPermission === null) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#fff" /></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.center}><Text style={{ color: 'white' }}>No access to camera</Text></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {!capturedPhoto ? (
        <Camera style={{ flex: 1 }} ref={cameraRef} type={facing}>
          <View style={styles.cameraUIContainer}>
            <View style={styles.topControls}>
              <Pressable onPress={toggleCameraFacing}>
                <Ionicons name="camera-reverse" size={32} color="white" />
              </Pressable>
            </View>
            <View style={styles.bottomControls}>
              <Pressable style={styles.captureButton} onPress={takePicture} />
            </View>
          </View>
        </Camera>
      ) : (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: capturedPhoto }} style={{ flex: 1 }} />
          <View style={styles.previewControls}>
            <Pressable onPress={() => setCapturedPhoto(null)} style={[styles.previewButton, { backgroundColor: '#B22222' }]}>
              <Ionicons name="close" size={24} color="white" />
              <Text style={styles.previewButtonText}>Retake</Text>
            </Pressable>
            <Pressable onPress={uploadPhoto} style={[styles.previewButton, { backgroundColor: '#228B22' }]} disabled={isUploading}>
              {isUploading ? <ActivityIndicator color="#fff" /> : <Ionicons name="checkmark" size={24} color="white" />}
              <Text style={styles.previewButtonText}>{isUploading ? 'Uploading...' : 'Upload'}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'black' 
  },
  cameraUIContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    padding: 30,
    alignItems: 'flex-end',
    paddingTop: 50,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    backgroundColor: 'white',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'grey'
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold'
  }
});
