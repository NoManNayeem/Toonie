import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import VideoTab from './VideoTab';
import AudioTab from './AudioTab';
import { Text } from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

const HomeScreen = ({ route, navigation }) => {
  const { videos, audios } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Toonie</Text>
        <Text style={styles.subTitle}>Your Tunes, Your Way</Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#a1a1a1',
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#ffffff' },
          tabBarStyle: { backgroundColor: '#6200ee' },
        }}
      >
        <Tab.Screen
          name="Videos"
          children={() => <VideoTab videos={videos} navigation={navigation} />}
        />
        <Tab.Screen
          name="Music"
          children={() => <AudioTab audios={audios} navigation={navigation} />}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#6200ee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 5,
  },
});

export default HomeScreen;
