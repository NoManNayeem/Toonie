import React from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Card, Text, Avatar, useTheme } from 'react-native-paper'; // Paper components for theme

// Helper function to extract filename from URI
const getFileNameFromUri = (uri) => {
  return uri?.split('/').pop() || 'Unknown Audio';
};

const AudioTab = ({ audios, navigation, setNowPlaying }) => {
  const theme = useTheme(); // Get current theme

  const handleAudioSelect = (audioUri) => {
    try {
      if (audioUri) {
        setNowPlaying(audioUri); // Set the selected audio as "Now Playing"
        navigation.navigate('AudioPlayer', { audioUri }); // Navigate to AudioPlayer
      } else {
        console.error('Invalid audio URI');
      }
    } catch (error) {
      console.error('Error selecting audio:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleAudioSelect(item.uri)}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {/* Album Art or Placeholder */}
          <Avatar.Icon size={48} icon="music" color="white" style={[styles.avatar, { backgroundColor: theme.colors.primary }]} />
          {/* Song Details */}
          <View style={styles.textContainer}>
            <Text style={[styles.songName, { color: theme.colors.text }]}>{getFileNameFromUri(item.uri)}</Text>
            <Text style={[styles.artistName, { color: theme.colors.disabled }]}>Unknown Artist</Text> {/* Placeholder for artist */}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={audios}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>No audios available.</Text>
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
    margin: 10,
    elevation: 2,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#6200ee', // Placeholder for album art
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  songName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
  },
});

export default AudioTab;
