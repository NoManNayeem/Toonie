import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import { Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Material Icons for the audio icon

const AudioTab = () => {
  const [audios, setAudios] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);

  useEffect(() => {
    async function getMediaPermissions() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        loadAudios();
      } else {
        console.log("Permission denied for accessing media library.");
      }
    }

    async function loadAudios() {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 100, // Fetch first 100 audios
      });
      setAudios(media.assets);
    }

    getMediaPermissions();
  }, []);

  const handleAudioSelect = async (audio) => {
    const fileUri = audio.uri;

    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: fileUri },
      { shouldPlay: true }
    );

    setSound(newSound);
    setIsPlaying(true);
    setSelectedAudio(audio);
  };

  const handlePausePlay = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {permissionGranted ? (
        <>
          <FlatList
            data={audios}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleAudioSelect(item)}>
                <Card style={styles.card}>
                  <View style={styles.cardContent}>
                    <Icon name="audiotrack" size={50} color="#999" />
                    <Text style={styles.cardText}>{item.filename}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            )}
          />

          {selectedAudio && (
            <View style={styles.audioControls}>
              <Text style={styles.currentTrack}>{selectedAudio.filename}</Text>
              <Button icon={isPlaying ? "pause" : "play"} mode="contained" onPress={handlePausePlay}>
                {isPlaying ? "Pause" : "Play"}
              </Button>
            </View>
          )}
        </>
      ) : (
        <Text style={styles.permissionText}>Permission is required to access audios.</Text>
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
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    elevation: 4,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 10,
  },
  permissionText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 50,
  },
  audioControls: {
    marginTop: 20,
    alignItems: 'center',
  },
  currentTrack: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default AudioTab;
