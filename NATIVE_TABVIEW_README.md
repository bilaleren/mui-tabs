# React Native TabView

You can switch between screens using TabView.

### Installation

```bash
yarn add react-native-pager-view
```

### Examples

#### Basic example

```tsx
import * as React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import type { RenderTabBar } from 'mui-tabs/native'
import { TabView, SceneMap, TabBar } from 'mui-tabs/native/TabView'
import PlatformPressable from 'mui-tabs/native/PlatformPressable'

const Home = () => (
  <View style={styles.screenContainer}>
    <Text>Home</Text>
  </View>
)

const Settings = () => (
  <View style={styles.screenContainer}>
    <Text>Settings</Text>
  </View>
)

const MyAccount = () => (
  <View style={styles.screenContainer}>
    <Text>MyAccount</Text>
  </View>
)

const renderScene = SceneMap({
  Home,
  Settings,
  MyAccount
})

const renderLazyPlaceholder = () => (
  <View style={styles.lazyPlaceholderContainer}>
    <ActivityIndicator size="large" color="#1976D2" />
  </View>
)

const App = () => {
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'Home', label: 'Home' },
    { key: 'Settings', label: 'Settings' },
    { key: 'MyAccount', label: 'My Account' }
  ])

  const renderTabBar: RenderTabBar = React.useCallback(
    (props) => (
      <TabBar
        {...props}
        tabStyle={styles.tab}
        tabComponent={PlatformPressable}
        estimatedTabWidth={80}
      />
    ),
    []
  );

  return (
    <View style={styles.container}>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tab: {
    width: 'auto'
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  lazyPlaceholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
```
