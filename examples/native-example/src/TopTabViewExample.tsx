import * as React from 'react';
import { Text, View } from 'react-native';
import type { RenderScene, RenderTabBar } from 'mui-tabs/native';
import TabView, { TabBar } from 'mui-tabs/native/TabView';
import PlatformPressable from 'mui-tabs/native/PlatformPressable';
import LazyPlaceholder from './components/LazyPlaceholder';

const Scene = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <Text style={{ textAlign: 'center' }}>{title}</Text>
  </View>
);

const renderScene: RenderScene = ({ route }) => {
  switch (route.key) {
    case 'home':
      return <Scene title="Home" />;
    case 'basket':
      return <Scene title="Basket" />;
    case 'marketPlace':
      return <Scene title="Market Place" />;
    case 'settings':
      return <Scene title="Settings" />;
    case 'myAccount':
      return <Scene title="My Account" />;
    case 'favorites':
      return <Scene title="Favorites" />;
    default:
      return null;
  }
};

const TopTabViewExample = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', label: 'Home' },
    { key: 'basket', label: 'Basket' },
    { key: 'marketPlace', label: 'Market Place' },
    { key: 'settings', label: 'Settings' },
    { key: 'myAccount', label: 'My Account' },
    { key: 'favorites', label: 'Favorites' }
  ]);

  const renderLazyPlaceholder = React.useCallback(
    () => <LazyPlaceholder />,
    []
  );

  const renderTabBar: RenderTabBar = React.useCallback(
    (props) => <TabBar {...props} tabComponent={PlatformPressable} />,
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <TabView
        lazy={true}
        state={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        scrollEnabled={true}
        renderTabBar={renderTabBar}
        renderLazyPlaceholder={renderLazyPlaceholder}
      />
    </View>
  );
};

export default React.memo(TopTabViewExample);
