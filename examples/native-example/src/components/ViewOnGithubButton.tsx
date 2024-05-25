import * as React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { repository as githubRepoUrl } from '../../package.json';

const ViewOnGithubButton: React.FC = () => (
  <TouchableOpacity
    style={styles.viewOnGithubButton}
    onPress={() => Linking.openURL(githubRepoUrl)}
  >
    <IonIcon name="logo-github" size={40} />
    <Text>View On Github</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  viewOnGithubButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginVertical: 20
  }
});

export default ViewOnGithubButton
