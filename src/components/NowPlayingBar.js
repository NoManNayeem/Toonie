import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton, ProgressBar, useTheme } from 'react-native-paper'; // Paper components for theme
import SoundPlayer from 'react-native-sound-player'; // For audio control

// Helper function to extract filename from URI
const getFileNameFromUri = (uri) => {
  return uri?.split('/').pop() || 'No media playing';
};

const NowPlayingBar = ({ media, mediaType }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // Progress of the media
  const theme = useTheme(); // Get current theme for dynamic styles

  useEffect(() => {
    const updateProgress = async () => {
      try {
        const info = await SoundPlayer.getInfo(); // Get media info
        setProgress(info.currentTime / info.duration); // Calculate progress
      } catch (error) {
        console.error('Failed to get media info:', error); // Handle errors gracefully
      }
    };

    // Set up an interval to update progress every second
    const interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval); // Clear interval when component unmounts
  }, []);

  const handlePlayPause = () => {
    try {
      if (isPlaying) {
        SoundPlayer.pause(); // Pause the media
      } else {
        SoundPlayer.resume(); // Resume the media
      }
      setIsPlaying(!isPlaying); // Toggle play/pause state
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={() => {
        // Implement navigation to the full player screen if needed
      }}
    >
      <View style={styles.mediaInfo}>
        {/* Media Title */}
        <Text style={[styles.mediaTitle, { color: theme.colors.text }]}>
          {getFileNameFromUri(media)} {/* Display media file name */}
        </Text>
        {/* Play/Pause Button */}
        <IconButton
          icon={isPlaying ? 'pause' : 'play'}
          size={30}
          onPress={handlePlayPause}
          color={theme.colors.primary}
        />
      </View>
      {/* Progress Bar */}
      <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  progressBar: {
    marginTop: 10,
    height: 4,
    width: '100%',
  },
});

export default NowPlayingBar;
