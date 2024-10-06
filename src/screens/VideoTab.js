import React from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper'; // Paper components for theme

// Helper function to extract filename from URI
const getFileNameFromUri = (uri) => {
  return uri?.split('/').pop() || 'Unknown Video';
};

const VideoTab = ({ videos, navigation, setNowPlaying }) => {
  const theme = useTheme(); // Get current theme

  const handleVideoSelect = (videoUri) => {
    try {
      if (videoUri) {
        setNowPlaying(videoUri); // Set the selected video as "Now Playing"
        navigation.navigate('VideoPlayer', { videoUri }); // Navigate to VideoPlayer
      } else {
        console.error('Invalid video URI');
      }
    } catch (error) {
      console.error('Error selecting video:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleVideoSelect(item.uri)}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {/* Video Icon */}
          <IconButton icon="video" color={theme.colors.primary} size={40} />
          {/* File Name */}
          <View style={styles.textContainer}>
            <Text style={[styles.cardText, { color: theme.colors.text }]}>
              {getFileNameFromUri(item.uri)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2} // Display videos in a grid format with two columns
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>No videos available.</Text>
          </View>
        )}
        contentContainerStyle={styles.flatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flatList: {
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    margin: 10,
    elevation: 2,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
  },
});

export default VideoTab;
