import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { Video } from 'expo-av';
import { IconButton } from 'react-native-paper';
import * as ScreenOrientation from 'expo-screen-orientation';

const VideoPlayer = ({ route }) => {
  const { videoUri } = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const changeOrientation = async () => {
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      }
    };

    changeOrientation();
  }, [isFullscreen]);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to play/pause the video.');
      console.error('Video play/pause error:', error);
    }
  };

  const handleMute = async () => {
    try {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to mute/unmute the video.');
      console.error('Video mute/unmute error:', error);
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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
        source={{ uri: videoUri }}
        rate={1.0}
        volume={1.0}
        isMuted={isMuted}
        resizeMode="contain"
        shouldPlay={isPlaying}
        style={styles.videoPlayer}
      />
      <View style={styles.controls}>
        <IconButton
          icon={isPlaying ? 'pause' : 'play'}
          size={30}
          onPress={handlePlayPause}
        />
        <IconButton
          icon={isMuted ? 'volume-off' : 'volume-high'}
          size={30}
          onPress={handleMute}
        />
        <IconButton
          icon="fullscreen"
          size={30}
          onPress={handleFullscreen}
        />
      </View>
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
  errorText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default VideoPlayer;
