import React from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AudioTab = ({ audios, navigation }) => {
  const handleAudioSelect = (audioUri) => {
    if (audioUri) {
      navigation.navigate('AudioPlayer', { audioUri });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={audios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleAudioSelect(item.uri)}>
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <Icon name="audiotrack" size={50} color="#6200ee" />
                <Text style={styles.cardText}>{item.filename}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No audios available.</Text>
          </View>
        )}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  flatList: {
    flex: 1,
  },
  card: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    elevation: 4,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#ff0000',
  },
});

export default AudioTab;
