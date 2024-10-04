import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Text, View, Modal, Button, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Material Icons for the video icon

const VideoTab = () => {
  const [videos, setVideos] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function getMediaPermissions() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        loadVideos();
      } else {
        console.log("Permission denied for accessing media library.");
      }
    }

    async function loadVideos() {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.video,
        first: 100, // Fetch first 100 videos
      });

      const videosWithThumbnails = await Promise.all(
        media.assets.map(async (video) => {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(video.id);
          return { ...video, thumbnail: assetInfo.hasOwnProperty('thumbnail') ? assetInfo.thumbnail : null };
        })
      );

      setVideos(videosWithThumbnails);
    }

    getMediaPermissions();
  }, []);

  const handleVideoSelect = (video) => {
    const fileUri = video.uri;
    setSelectedVideo(fileUri);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {permissionGranted ? (
        <>
          <FlatList
            data={videos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleVideoSelect(item)}>
                <Card style={styles.card}>
                  {item.thumbnail ? (
                    <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                  ) : (
                    <View style={styles.iconContainer}>
                      <Icon name="videocam" size={80} color="#999" />
                    </View>
                  )}
                  <Text style={styles.cardText}>{item.filename}</Text>
                </Card>
              </TouchableOpacity>
            )}
          />


          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.videoContainer}>
              {selectedVideo && (
                <Video
                  source={{ uri: selectedVideo }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="contain"
                  shouldPlay
                  style={styles.videoPlayer}
                />
              )}
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </Modal>
        </>
      ) : (
        <Text style={styles.permissionText}>Permission is required to access videos.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  card: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    elevation: 4,
    borderRadius: 8,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  iconContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  permissionText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 50,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: 300,
  },
});

export default VideoTab;
