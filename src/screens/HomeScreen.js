import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import VideoTab from './VideoTab';
import AudioTab from './AudioTab';
import { Searchbar, Text, Avatar, useTheme } from 'react-native-paper'; // Paper components for better UI

const Tab = createMaterialTopTabNavigator();

// Helper function to filter media based on search query
const filterMedia = (media, query) => {
  const lowerCaseQuery = query.toLowerCase();
  return media.filter((item) => item.filename.toLowerCase().includes(lowerCaseQuery));
};

const HomeScreen = ({ route, navigation }) => {
  const { videos, audios, setNowPlaying, handleThemeToggle } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState(videos);
  const [filteredAudios, setFilteredAudios] = useState(audios);
  const theme = useTheme(); // Get theme for dynamic styles

  useEffect(() => {
    try {
      setFilteredVideos(filterMedia(videos, searchQuery));
      setFilteredAudios(filterMedia(audios, searchQuery));
    } catch (error) {
      console.error('Error filtering media:', error);
    }
  }, [searchQuery, videos, audios]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      {/* App Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Avatar.Icon size={48} icon="music" color="white" style={styles.avatar} />
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.onPrimary }]}>Toonie</Text>
          <Text style={[styles.subTitle, { color: theme.colors.onPrimary }]}>Your Tunes, Your Way</Text>
        </View>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search videos or music"
        onChangeText={(query) => setSearchQuery(query)}
        value={searchQuery}
        style={styles.searchbar}
        iconColor={theme.colors.primary} // Dynamic icon color based on theme
        inputStyle={{ color: theme.colors.text }} // Dynamic text color based on theme
      />

      {/* Tabs for Videos and Music */}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.text,
          tabBarInactiveTintColor: theme.colors.disabled,
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
          tabBarStyle: { backgroundColor: theme.colors.surface },
        }}
      >
        <Tab.Screen
          name="Videos"
          children={() => (
            <VideoTab
              videos={filteredVideos}
              navigation={navigation}
              setNowPlaying={setNowPlaying}
            />
          )}
        />
        <Tab.Screen
          name="Music"
          children={() => (
            <AudioTab
              audios={filteredAudios}
              navigation={navigation}
              setNowPlaying={setNowPlaying}
            />
          )}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#03dac4',
  },
  titleContainer: {
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    marginTop: 5,
  },
  searchbar: {
    margin: 10,
    borderRadius: 30,
  },
});

export default HomeScreen;
