import * as React from 'react';
import { Text, View } from 'react-native';
import TabView, { TabBar } from 'mui-tabs/native/TabView';
import PlatformPressable from 'mui-tabs/native/PlatformPressable';
import LazyPlaceholder from './components/LazyPlaceholder';
import type { RenderScene, RenderTabBar, Route } from 'mui-tabs/native';

const Scene = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <Text style={{ textAlign: 'center' }}>{title}</Text>
  </View>
);

const renderScene: RenderScene = ({ route }) => (
  <Scene title={route.label || 'Home'} />
);

const BottomTabViewExample = () => {
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
    (props) => (
      <TabBar
        {...props}
        tabComponent={PlatformPressable}
        indicatorStyle={{
          top: 0,
          bottom: undefined
        }}
      />
    ),
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <TabView<Route>
        lazy={true}
        state={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        scrollEnabled={true}
        renderTabBar={renderTabBar}
        tabBarPosition="bottom"
        renderLazyPlaceholder={renderLazyPlaceholder}
      />
    </View>
  );
};

export default React.memo(BottomTabViewExample);
