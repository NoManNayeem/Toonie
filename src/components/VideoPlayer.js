import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Alert, Text } from 'react-native';
import Video from 'react-native-video'; // For video playback
import { IconButton, ProgressBar, Menu, useTheme } from 'react-native-paper'; // Paper components
import * as ScreenOrientation from 'expo-screen-orientation';

// Helper function to extract filename from URI
const getFileNameFromUri = (uri) => {
  return uri?.split('/').pop() || 'Unknown';
};

const VideoPlayerScreen = ({ route }) => {
  const { videoUri } = route.params; // Ensure that videoUri is passed correctly
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false); // Playback Speed Menu
  const videoRef = useRef(null); // Correctly initializing videoRef
  const theme = useTheme(); // Get current theme for dynamic styles

  useEffect(() => {
    const changeOrientation = async () => {
      try {
        if (isFullscreen) {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        } else {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        }
      } catch (error) {
        console.error('Error changing screen orientation:', error);
      }
    };

    changeOrientation();

    return () => {
      ScreenOrientation.unlockAsync(); // Ensure to unlock orientation when leaving screen
    };
  }, [isFullscreen]);

  const handlePlayPause = () => {
    try {
      if (isPlaying) {
        videoRef.current.pause(); // Pause video
      } else {
        videoRef.current.play(); // Play video
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while toggling play/pause.');
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    setMenuVisible(false);
  };

  const onProgress = (progressData) => {
    setProgress(progressData.currentTime / duration);
  };

  const onLoad = (meta) => {
    setDuration(meta.duration);
  };

  if (!videoUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No video available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }} // Correctly pass the source prop
        style={styles.videoPlayer}
        autoplay={true}
        resizeMode="contain"
        muted={isMuted}
        rate={playbackSpeed}
        onProgress={onProgress}
        onLoad={onLoad}
        onError={() => Alert.alert('Error', 'An error occurred during video playback.')}
      />
      <View style={styles.controls}>
        <IconButton
          icon={isPlaying ? 'pause' : 'play'}
          size={40}
          color={theme.colors.primary}
          onPress={handlePlayPause}
        />
        <IconButton
          icon={isMuted ? 'volume-off' : 'volume-high'}
          size={40}
          color={theme.colors.primary}
          onPress={handleMute}
        />
        <IconButton
          icon="fullscreen"
          size={40}
          color={theme.colors.primary}
          onPress={handleFullscreen}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="speedometer"
              size={40}
              color={theme.colors.primary}
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item onPress={() => handleSpeedChange(0.5)} title="0.5x" />
          <Menu.Item onPress={() => handleSpeedChange(1.0)} title="Normal" />
          <Menu.Item onPress={() => handleSpeedChange(1.5)} title="1.5x" />
          <Menu.Item onPress={() => handleSpeedChange(2.0)} title="2.0x" />
        </Menu>
      </View>
      <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  videoPlayer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBar: {
    width: '100%',
    height: 4,
    marginVertical: 10,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default VideoPlayerScreen;
