import * as React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const LazyPlaceholder: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#1976D2" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default LazyPlaceholder;
