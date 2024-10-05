// src/screens/LoadingScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';

const LoadingScreen = () => {
  const theme = useTheme();
  const [loadingTime, setLoadingTime] = useState(0);
  const [alertShown, setAlertShown] = useState(false); // To track if the alert is shown

  // Monitor loading time to notify the user if it takes too long
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime((prev) => prev + 1);
    }, 1000);

    if (loadingTime > 10 && !alertShown) {
      Alert.alert('Loading Taking Longer', 'This is taking a bit longer than expected. Please be patient.');
      setAlertShown(true); // Prevent multiple alerts
    }

    return () => clearInterval(interval); // Clear the interval when loading completes
  }, [loadingTime, alertShown]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>Loading Toonie...</Text>
      <Text style={styles.loadingSubText}>Fetching all videos and audios, please wait.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200ee',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loadingSubText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffffff',
  },
});

export default LoadingScreen;
