import * as React from 'react';
import { Text, View } from 'react-native';
import { TabView, SceneMap } from 'mui-tabs/native/TabView';
import PlatformPressable from 'mui-tabs/native/PlatformPressable';
import LazyPlaceholder from './components/LazyPlaceholder';

const Screen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <Text style={{ textAlign: 'center' }}>{title}</Text>
  </View>
);

const renderScene = SceneMap({
  home: () => <Screen title="Home" />,
  basket: () => <Screen title="Basket" />,
  marketPlace: () => <Screen title="Market Place" />,
  settings: () => <Screen title="Settings" />,
  myAccount: () => <Screen title="My Account" />,
  favorites: () => <Screen title="Favorites" />
});

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

  return (
    <View style={{ flex: 1 }}>
      <TabView
        lazy={true}
        state={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        scrollEnabled={true}
        tabBarProps={{
          TabComponent: PlatformPressable
        }}
        renderLazyPlaceholder={renderLazyPlaceholder}
      />
    </View>
  );
};

export default TopTabViewExample;
