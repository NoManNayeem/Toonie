import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as MediaLibrary from 'expo-media-library';
import HomeScreen from './src/screens/HomeScreen';
import AudioPlayer from './src/components/AudioPlayer';
import VideoPlayer from './src/components/VideoPlayer';
import LoadingScreen from './src/screens/LoadingScreen';
import NowPlayingBar from './src/components/NowPlayingBar';
import { Alert, View } from 'react-native';
import { PaperProvider, Button, Text } from 'react-native-paper';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Define the StackNavigator
const Stack = createStackNavigator();

// Custom Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF6F00', // Custom primary color
    accent: '#00BFA5', // Custom accent color
    background: '#F4F4F4', // Custom background color
    surface: '#FFFFFF',
    text: '#212121', // Custom text color
    placeholder: '#757575',
  },
  roundness: 10, // Adding roundness for buttons and cards
};

// Custom Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF6F00', // Custom primary color
    accent: '#00BFA5', // Custom accent color
    background: '#121212', // Custom dark background
    surface: '#333333',
    text: '#E0E0E0', // Custom text color for dark theme
    placeholder: '#BDBDBD',
  },
  roundness: 10, // Adding roundness for buttons and cards
};

// Main App component
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Theme switch state
  const [nowPlaying, setNowPlaying] = useState(null); // Currently playing media

  // Load media files function
  const loadMediaFiles = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const videoMedia = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.video,
          first: 100,
        });
        const audioMedia = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
          first: 100,
        });
        setVideos(videoMedia.assets);
        setAudios(audioMedia.assets);
      } else {
        setErrorMessage('Permission Denied. Please grant media access.');
      }
    } catch (error) {
      setErrorMessage('Failed to load media files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMediaFiles();
  }, []);

  // Toggle between light and dark theme
  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Retry loading media files
  const retryLoadMediaFiles = () => {
    setIsLoading(true);
    setErrorMessage(null);
    loadMediaFiles();
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <NavigationContainer>
          <Stack.Navigator>
            {isLoading ? (
              <Stack.Screen
                name="Loading"
                component={LoadingScreen}
                options={{ headerShown: false }}
              />
            ) : errorMessage ? (
              <Stack.Screen
                name="Error"
                component={() => (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text>{errorMessage}</Text>
                    <Button mode="contained" onPress={retryLoadMediaFiles}>
                      Retry
                    </Button>
                  </View>
                )}
                options={{ headerShown: false }}
              />
            ) : (
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  initialParams={{
                    videos,
                    audios,
                    nowPlaying,
                    setNowPlaying,
                    handleThemeToggle,
                  }}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="VideoPlayer"
                  component={VideoPlayer}
                  initialParams={{ nowPlaying, setNowPlaying }}
                  options={{ title: 'Video Player' }}
                />
                <Stack.Screen
                  name="AudioPlayer"
                  component={AudioPlayer}
                  initialParams={{ nowPlaying, setNowPlaying }}
                  options={{ title: 'Audio Player' }}
                />
              </>
            )}
          </Stack.Navigator>
          {nowPlaying && <NowPlayingBar media={nowPlaying} />}
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
