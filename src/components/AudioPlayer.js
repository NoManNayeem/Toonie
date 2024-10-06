import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import SoundPlayer from 'react-native-sound-player'; // For audio playback
import { IconButton, Slider, ProgressBar, Avatar, Text, useTheme } from 'react-native-paper';

// Helper function to extract filename from URI
const getFileNameFromUri = (uri) => {
  return uri?.split('/').pop() || 'Unknown';
};

const AudioPlayer = ({ route }) => {
  const { audioUri } = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1.0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false); // Shuffle mode
  const [isRepeat, setIsRepeat] = useState(false);   // Repeat mode
  const theme = useTheme(); // Get current theme for dynamic styles

  useEffect(() => {
    const loadAudio = async () => {
      try {
        SoundPlayer.playUrl(audioUri); // Start playing audio
        setIsPlaying(true);

        const info = await SoundPlayer.getInfo();
        setDuration(info.duration); // Set duration of the audio file
      } catch (error) {
        Alert.alert('Error', 'Failed to load the audio file.');
      }
    };

    loadAudio();

    return () => {
      SoundPlayer.stop(); // Stop playing audio when the component unmounts
    };
  }, [audioUri]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const info = await SoundPlayer.getInfo();
        setPosition(info.currentTime); // Update position as the audio plays
      } catch (error) {
        console.error('Error getting audio info:', error);
      }
    }, 1000);

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  const handlePlayPause = () => {
    try {
      if (isPlaying) {
        SoundPlayer.pause(); // Pause the audio
      } else {
        SoundPlayer.resume(); // Resume the audio
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while toggling play/pause.');
    }
  };

  const handleShuffleToggle = () => {
    setIsShuffle(!isShuffle); // Toggle shuffle mode
  };

  const handleRepeatToggle = () => {
    setIsRepeat(!isRepeat); // Toggle repeat mode
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Album Art or Placeholder */}
      <Avatar.Icon size={120} icon="music" color="white" style={[styles.avatar, { backgroundColor: theme.colors.primary }]} />
      {/* Track Info */}
      <Text style={[styles.trackTitle, { color: theme.colors.text }]}>
        {getFileNameFromUri(audioUri)}
      </Text>
      <Text style={[styles.artistName, { color: theme.colors.text }]}>
        Unknown Artist
      </Text>

      {/* Progress Bar */}
      <ProgressBar progress={position / duration} color={theme.colors.primary} style={styles.progressBar} />

      <View style={styles.controls}>
        {/* Shuffle */}
        <IconButton
          icon="shuffle"
          size={30}
          color={isShuffle ? theme.colors.primary : theme.colors.disabled}
          onPress={handleShuffleToggle}
        />
        {/* Play/Pause */}
        <IconButton
          icon={isPlaying ? 'pause' : 'play'}
          size={40}
          color={theme.colors.primary}
          onPress={handlePlayPause}
        />
        {/* Repeat */}
        <IconButton
          icon="repeat"
          size={30}
          color={isRepeat ? theme.colors.primary : theme.colors.disabled}
          onPress={handleRepeatToggle}
        />
      </View>

      {/* Seek Bar */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={(value) => {
          try {
            SoundPlayer.seek(value); // Seek to position in audio
          } catch (error) {
            Alert.alert('Error', 'Failed to seek the audio file.');
          }
        }}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.disabled}
      />

      {/* Volume Control */}
      <View style={styles.volumeControl}>
        <IconButton
          icon={volume > 0 ? 'volume-high' : 'volume-off'}
          size={30}
          color={theme.colors.primary}
          onPress={() => setVolume(volume > 0 ? 0 : 1)} // Mute/Unmute audio
        />
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={(newVolume) => {
            setVolume(newVolume);
            SoundPlayer.setVolume(newVolume); // Adjust volume
          }}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.disabled}
        />
      </View>

      {/* Time Display */}
      <Text style={[styles.time, { color: theme.colors.text }]}>
        {new Date(position * 1000).toISOString().substr(14, 5)} / {new Date(duration * 1000).toISOString().substr(14, 5)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginBottom: 20,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  artistName: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressBar: {
    width: '100%',
    height: 5,
    marginVertical: 10,
  },
  slider: {
    width: '100%',
    marginVertical: 10,
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  volumeSlider: {
    flex: 1,
    marginLeft: 10,
  },
  time: {
    fontSize: 14,
    marginTop: 10,
  },
});

export default AudioPlayer;
