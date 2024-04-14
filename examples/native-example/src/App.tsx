import * as React from 'react';
import { Text, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import type { RenderTabBar } from 'mui-tabs/native';
import TabView, { SceneMap, TabBar } from 'mui-tabs/native/TabView';
import PlatformPressable from 'mui-tabs/native/PlatformPressable';
import { repository as githubRepoUrl } from '../package.json';
import TabsExample from './TabsExample';
import TopTabViewExample from './TopTabViewExample';
import BottomTabViewExample from './BottomTabViewExample';
import {
  SafeAreaView,
  SafeAreaProvider,
  initialWindowMetrics
} from 'react-native-safe-area-context';
import LazyPlaceholder from './components/LazyPlaceholder';

const renderScene = SceneMap({
  TabsExample,
  TopTabViewExample,
  BottomTabViewExample
});

const ViewOnGithubButton: React.FC = () => (
  <TouchableOpacity
    style={styles.viewOnGithubButton}
    onPress={() => Linking.openURL(githubRepoUrl)}
  >
    <IonIcon name="logo-github" size={40} />
    <Text>View On Github</Text>
  </TouchableOpacity>
);

const App: React.FC = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'TabsExample', label: 'Tabs Examples' },
    { key: 'TopTabViewExample', label: 'Top TabView Example' },
    { key: 'BottomTabViewExample', label: 'Bottom TabView Example' }
  ]);

  const renderLazyPlaceholder = React.useCallback(
    () => <LazyPlaceholder />,
    []
  );

  const renderTabBar: RenderTabBar = React.useCallback(
    (props) => (
      <TabBar
        {...props}
        tabStyle={{
          width: 'auto'
        }}
        tabComponent={PlatformPressable}
        estimatedTabWidth={130}
      />
    ),
    []
  );

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaView style={styles.container}>
        <ViewOnGithubButton />
        <TabView
          lazy={true}
          state={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          scrollEnabled={true}
          renderTabBar={renderTabBar}
          renderLazyPlaceholder={renderLazyPlaceholder}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  viewOnGithubButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginVertical: 20
  }
});

export default App;
