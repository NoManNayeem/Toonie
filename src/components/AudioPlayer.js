import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { IconButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';

const AudioPlayer = ({ route }) => {
  const { audioUri } = route.params;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    async function loadAudio() {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
            setIsPlaying(status.isPlaying);
          }
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to load the audio file.');
        console.error('Audio loading error:', error);
      }
    }

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUri]);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to play/pause the audio.');
      console.error('Audio play/pause error:', error);
    }
  };

  const handleVolumeChange = async (newVolume) => {
    try {
      setVolume(newVolume);
      await sound.setVolumeAsync(newVolume);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to adjust the volume.');
      console.error('Volume change error:', error);
    }
  };

  const handleSliderChange = async (value) => {
    try {
      await sound.setPositionAsync(value);
      setPosition(value);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to change the track position.');
      console.error('Position change error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.trackTitle}>{audioUri.split('/').pop()}</Text>
      <View style={styles.controls}>
        <IconButton
          icon={isPlaying ? 'pause' : 'play'}
          size={30}
          onPress={handlePlayPause}
        />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={handleSliderChange}
          minimumTrackTintColor="#6200ee"
          maximumTrackTintColor="#999"
        />
        <IconButton
          icon={volume > 0 ? 'volume-high' : 'volume-off'}
          size={30}
          onPress={() => handleVolumeChange(volume > 0 ? 0 : 1)}
        />
      </View>
      <Text style={styles.time}>
        {new Date(position).toISOString().substr(11, 8)} / {new Date(duration).toISOString().substr(11, 8)}
      </Text>
      <Slider
        style={styles.volumeSlider}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={handleVolumeChange}
        minimumTrackTintColor="#6200ee"
        maximumTrackTintColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  time: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
  volumeSlider: {
    width: '80%',
    marginTop: 20,
  },
});

export default AudioPlayer;
