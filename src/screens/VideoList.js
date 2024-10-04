// src/screens/VideoList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

const VideoList = ({ route }) => {
  const { folder } = route.params;
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function loadVideos() {
      const folderUri = FileSystem.documentDirectory + folder;
      const files = await FileSystem.readDirectoryAsync(folderUri);

      // Filter for video files (e.g., .mp4)
      const videoFiles = files.filter(file => file.endsWith('.mp4'));
      setVideos(videoFiles);
    }

    loadVideos();
  }, [folder]);

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View style={styles.card}>
              <Text style={styles.cardText}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  card: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VideoList;
