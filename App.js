import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as MediaLibrary from 'expo-media-library';
import HomeScreen from './src/screens/HomeScreen';
import AudioPlayer from './src/components/AudioPlayer';
import VideoPlayer from './src/components/VideoPlayer';
import LoadingScreen from './src/screens/LoadingScreen';
import { Alert } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
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
          setErrorMessage('Media permissions not granted');
          Alert.alert('Permission Denied', 'Please grant media access permissions to load videos and audios.');
        }
      } catch (error) {
        setErrorMessage('Failed to load media files. Please try again.');
        Alert.alert('Error', 'An error occurred while loading media files.');
        console.error('Error loading media files:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMediaFiles();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoading ? (
            <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
          ) : errorMessage ? (
            <Stack.Screen
              name="Error"
              component={() => <ErrorScreen message={errorMessage} />}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ videos, audios }} // Pass videos and audios as initialParams
                options={{ headerShown: false }}
              />
              <Stack.Screen name="VideoPlayer" component={VideoPlayer} options={{ title: 'Video Player' }} />
              <Stack.Screen name="AudioPlayer" component={AudioPlayer} options={{ title: 'Audio Player' }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
