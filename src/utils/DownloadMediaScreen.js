import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper'; // Floating Action Button
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const DownloadMediaScreen = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Sample video and audio URLs
  const videoUrls = [
    'https://samplelib.com/lib/preview/mp4/sample-30s.mp4', 
    'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    'https://sample-videos.com/video123/mp4/720/sample_640x360.mp4', 
    'https://filesamples.com/samples/video/mp4/sample_960x540.mp4',
    'https://filesamples.com/samples/video/mp4/sample_1280x720.mp4'
  ];

  const audioUrls = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://filesamples.com/samples/audio/mp3/sample1.mp3',
    'https://filesamples.com/samples/audio/mp3/sample2.mp3',
    'https://filesamples.com/samples/audio/mp3/sample3.mp3'
  ];

  // Request permission to write to media library
  const requestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
      Alert.alert('Permission granted', 'You can now download files.');
    } else {
      Alert.alert('Permission denied', 'Cannot download files without permission.');
    }
  };

  // Download and store file in public directory (Movies or Music)
  const downloadFile = async (url, fileName, directory) => {
    try {
      const fileUri = FileSystem.cacheDirectory + fileName; // Download to a temp location first
      const { uri } = await FileSystem.downloadAsync(url, fileUri);

      // Save the file to public media storage
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync(directory);
      if (album == null) {
        await MediaLibrary.createAlbumAsync(directory, asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert('Download successful', `File saved in ${directory} directory.`);
    } catch (error) {
      Alert.alert('Download error', error.message);
    }
  };

  const handleDownload = async () => {
    if (!permissionGranted) {
      Alert.alert('No permission', 'Please grant permission to access the media library.');
      return;
    }

    // Download videos to the Movies directory
    await Promise.all(
      videoUrls.map((url, index) => downloadFile(url, `test-video-${index + 1}.mp4`, 'Movies'))
    );

    // Download audios to the Music directory
    await Promise.all(
      audioUrls.map((url, index) => downloadFile(url, `test-audio-${index + 1}.mp3`, 'Music'))
    );
  };

  return (
    <View style={styles.container}>
      <FAB
        style={styles.fab}
        small
        icon="download"
        label="Download Media"
        onPress={() => {
          if (!permissionGranted) {
            requestPermission();
          } else {
            handleDownload();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee', // Customize button color
  },
});

export default DownloadMediaScreen;
