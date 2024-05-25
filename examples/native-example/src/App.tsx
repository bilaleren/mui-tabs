import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { RenderTabBar } from 'mui-tabs/native';
import TabView, { TabBar, SceneMap } from 'mui-tabs/native/TabView';
import PlatformPressable from 'mui-tabs/native/PlatformPressable';
import TabsExample from './TabsExample';
import TopTabViewExample from './TopTabViewExample';
import BottomTabViewExample from './BottomTabViewExample';
import {
  SafeAreaView,
  SafeAreaProvider,
  initialWindowMetrics
} from 'react-native-safe-area-context';
import { LazyPlaceholder, ViewOnGithubButton } from './components';

const renderScene = SceneMap({
  TabsExample,
  TopTabViewExample,
  BottomTabViewExample
});

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
